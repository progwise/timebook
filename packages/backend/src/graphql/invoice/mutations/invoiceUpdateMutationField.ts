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

          // Adjust sendDate to the start of the day in UTC (midnight)
          const adjustedSendDate = new Date(sendDate)
          adjustedSendDate.setUTCHours(0, 0, 0, 0) // Set to midnight in UTC

          // Get the current time in UTC for comparison
          const localNowUTC = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)

          // Now, compare the UTC versions of sendDate and localNow
          if (adjustedSendDate.getTime() > localNowUTC.getTime()) {
            throw new Error('Invoice send date must not be in the future')
          }

          updateData.sendDate = adjustedSendDate
          break
        case InvoiceAction.Pay:
          if (!payDate) {
            throw new Error('Pay date is required')
          }

          // Adjust payDate to the start of the day in UTC (midnight)
          const adjustedPayDate = new Date(payDate)
          adjustedPayDate.setUTCHours(0, 0, 0, 0) // Set to midnight in UTC

          // Get the current time in UTC for comparison
          const localNowUTCForPay = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)

          // Compare the UTC versions of payDate and localNow
          if (adjustedPayDate.getTime() >= localNowUTCForPay.getTime()) {
            throw new Error('Invoice pay date must not be in the future')
          }

          const existingInvoice = await prisma.invoice.findUnique({
            where: { id: invoiceId.toString() },
            select: { sendDate: true },
          })

          if (existingInvoice?.sendDate) {
            const existingSendDate = new Date(existingInvoice.sendDate)

            // Set both dates to UTC midnight for comparison
            existingSendDate.setUTCHours(0, 0, 0, 0)
            adjustedPayDate.setUTCHours(0, 0, 0, 0)

            // Compare the adjusted pay date with the send date
            if (adjustedPayDate.getTime() < existingSendDate.getTime()) {
              throw new Error('Invoice pay date must not be before send date')
            }
          }

          updateData.payDate = adjustedPayDate
          break
        case InvoiceAction.ResetPayDate:
          updateData.payDate = null
          break
      }

      const updatedInvoice = await prisma.invoice.update({
        ...query,
        data: updateData,
        where: { id: invoiceId.toString() },
      })

      if (invoiceWorkFrom && invoiceWorkUntil && invoiceWorkFrom >= invoiceWorkUntil) {
        throw new Error('The end date must be after the start date')
      }

      if (invoiceWorkFrom || invoiceWorkUntil) {
        const existingInvoiceItems = await prisma.invoiceItem.findMany({
          where: { invoiceId: updatedInvoice.id },
          select: { taskId: true },
        })

        const existingTaskIds = new Set(existingInvoiceItems.map((invoiceItem) => invoiceItem.taskId))

        const workHours = await prisma.workHour.groupBy({
          by: ['taskId'],
          where: {
            date: {
              ...(invoiceWorkFrom && { gte: invoiceWorkFrom }),
              ...(invoiceWorkUntil && { lte: invoiceWorkUntil }),
            },

            task: { project: { organization: { id: updatedInvoice.organizationId } } },

            taskId: {
              notIn: [...existingTaskIds],
            },
          },

          _sum: {
            duration: true,
          },
        })

        const invoiceItems = workHours.map((workHour) => ({
          invoiceId: updatedInvoice.id,
          taskId: workHour.taskId,
          duration: workHour._sum.duration ?? 0,
          hourlyRate: 0,
        }))

        if (invoiceItems.length > 0) {
          await prisma.invoiceItem.createMany({
            data: invoiceItems,
          })
        }
      }

      return updatedInvoice
    },
  }),
)
