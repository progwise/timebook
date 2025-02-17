/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceAction } from '../invoiceStatusEnum'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      id: t.arg.id({ description: 'ID of the invoice' }),
      data: t.arg({ type: InvoiceUpdateInput }),
      action: t.arg({ type: InvoiceAction, description: 'Action to perform on the invoice', required: false }),
    },
    authScopes: (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId?.toString() }),
    resolve: async (
      query,
      _source,
      {
        id: invoiceId,
        data: { customerAddress, customerName, invoiceDate, invoiceWorkFrom, invoiceWorkUntil, sendDate, payDate },
        action,
      },
    ) => {
      type UpdateData = {
        customerAddress?: string | null
        customerName?: string
        invoiceDate?: Date
        invoiceWorkFrom?: Date
        invoiceWorkUntil?: Date
        invoiceStatus?: 'DRAFT' | 'SENT' | 'PAID'
        sendDate?: Date | null
        payDate?: Date | null
      }

      const updateData: UpdateData = {
        customerAddress: customerAddress,
        customerName: customerName ?? undefined,
        invoiceDate: invoiceDate ?? undefined,
        invoiceWorkFrom: invoiceWorkFrom ?? undefined,
        invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        sendDate: sendDate,
        payDate: payDate,
        invoiceStatus:
          action === InvoiceAction.Withdraw
            ? 'DRAFT'
            : action === InvoiceAction.Send
              ? 'SENT'
              : // eslint-disable-next-line unicorn/no-nested-ternary
                action === InvoiceAction.Pay
                ? 'PAID'
                : 'DRAFT',
      }

      // Get the current local date
      const localNow = new Date()

      switch (action) {
        case InvoiceAction.Withdraw:
          updateData.sendDate = null
          updateData.payDate = null
          break
        case InvoiceAction.Send:
          if (!sendDate) {
            throw new Error('Send date is required')
          }
          // Adjust sendDate to the start of the day to avoid time zone issues
          const adjustedSendDate = new Date(sendDate)
          adjustedSendDate.setHours(0, 0, 0, 0) // Set to midnight in local time

          // Convert adjustedSendDate to UTC by accounting for the user's time zone offset
          const sendDateInUTC = new Date(adjustedSendDate.getTime() - adjustedSendDate.getTimezoneOffset() * 60_000)

          // Get the current time in UTC for comparison
          const localNowUTC = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)

          // Now, compare the UTC versions of sendDate and localNow
          if (sendDateInUTC.getTime() > localNowUTC.getTime()) {
            throw new Error('Invoice send date must not be in the future')
          }

          updateData.sendDate = sendDateInUTC
          break
        case InvoiceAction.Pay:
          if (!payDate) {
            throw new Error('Pay date is required')
          }
          // Adjust payDate to the start of the day to avoid time zone issues
          const adjustedPayDate = new Date(payDate)
          adjustedPayDate.setHours(0, 0, 0, 0)

          // Convert adjustedPayDate to UTC by accounting for the user's time zone offset
          const payDateInUTC = new Date(adjustedPayDate.getTime() - adjustedPayDate.getTimezoneOffset() * 60_000)

          // Get the current time in UTC for comparison
          const localNowUTCForPay = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)

          // Compare the UTC versions of payDate and localNow
          if (payDateInUTC.getTime() >= localNowUTCForPay.getTime()) {
            throw new Error('Invoice pay date must not be in the future')
          }

          const existingInvoice = await prisma.invoice.findUnique({
            where: { id: invoiceId.toString() },
            select: { sendDate: true },
          })

          if (existingInvoice?.sendDate) {
            const existingSendDate = new Date(existingInvoice.sendDate)

            // Convert existing send date to UTC for comparison
            const existingSendDateUTC = new Date(
              existingSendDate.getTime() - existingSendDate.getTimezoneOffset() * 60_000,
            )

            // Set both dates to the start of the day (midnight in UTC) for comparison
            existingSendDateUTC.setHours(0, 0, 0, 0)
            payDateInUTC.setHours(0, 0, 0, 0)

            // Compare the pay date with the send date
            if (payDateInUTC.getTime() < existingSendDateUTC.getTime()) {
              throw new Error('Invoice pay date must not be before send date')
            }
          }

          updateData.payDate = payDateInUTC
          break
        case InvoiceAction.ResetPayDate:
          updateData.payDate = null
          break
      }

      return prisma.invoice.update({
        ...query,
        data: updateData,
        where: { id: invoiceId.toString() },
      })
    },
  }),
)
