/* eslint-disable unicorn/no-null */
import { convertToTimeZone } from 'date-fns-timezone'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceAction } from '../invoiceStatusEnum'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

// Utility function to adjust dates to UTC
const adjustDateToUTC = (localDate: Date | string): string => {
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate
  const zonedDate = convertToTimeZone(date, { timeZone: 'UTC' })
  const offset = date.getTimezoneOffset() * 60_000 // Convert minutes to milliseconds
  return new Date(zonedDate.getTime() - offset).toISOString()
}

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

      // Get the current date in UTC
      const localNow = new Date().toISOString()

      switch (action) {
        case InvoiceAction.Withdraw:
          updateData.sendDate = null
          updateData.payDate = null
          break
        case InvoiceAction.Send:
          if (!sendDate) {
            throw new Error('Send date is required')
          }
          const adjustedSendDate = adjustDateToUTC(sendDate)
          if (new Date(adjustedSendDate).getTime() > new Date(localNow).getTime()) {
            throw new Error('Invoice send date must not be in the future')
          }
          updateData.sendDate = new Date(adjustedSendDate)
          break
        case InvoiceAction.Pay:
          if (!payDate) {
            throw new Error('Pay date is required')
          }
          const adjustedPayDate = adjustDateToUTC(payDate)
          if (new Date(adjustedPayDate).getTime() >= new Date(localNow).getTime()) {
            throw new Error('Invoice pay date must not be in the future')
          }
          const existingInvoice = await prisma.invoice.findUnique({
            where: { id: invoiceId.toString() },
            select: { sendDate: true },
          })
          if (existingInvoice?.sendDate) {
            const existingSendDateUtc = new Date(existingInvoice.sendDate).toISOString()
            if (new Date(adjustedPayDate).getTime() < new Date(existingSendDateUtc).getTime()) {
              throw new Error('Invoice pay date must not be before send date')
            }
          }
          updateData.payDate = new Date(adjustedPayDate)
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
