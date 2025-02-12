/* eslint-disable unicorn/no-nested-ternary */

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
        customerAddress?: string
        customerName?: string
        invoiceDate?: Date
        invoiceWorkFrom?: Date
        invoiceWorkUntil?: Date
        invoiceStatus?: 'DRAFT' | 'SENT' | 'PAID'
        sendDate?: Date | null
        payDate?: Date | null
      }

      const updateData: UpdateData = {
        customerAddress: customerAddress ?? undefined,
        customerName: customerName ?? undefined,
        invoiceDate: invoiceDate ?? undefined,
        invoiceWorkFrom: invoiceWorkFrom ?? undefined,
        invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        sendDate: sendDate ?? undefined,
        payDate: payDate ?? undefined,
        invoiceStatus:
          action === InvoiceAction.Withdraw
            ? 'DRAFT'
            : action === InvoiceAction.Send
              ? 'SENT'
              : action === InvoiceAction.Pay
                ? 'PAID'
                : 'DRAFT',
      }

      switch (action) {
        case InvoiceAction.Withdraw:
          updateData.sendDate = null
          updateData.payDate = null
          break
        case InvoiceAction.Send:
          if (!sendDate) {
            throw new Error('Send date is required')
          }
          const invoiceSendDate = new Date(sendDate)
          if (invoiceSendDate >= new Date()) {
            throw new Error('Invoice send date must not be in the future')
          }
          updateData.sendDate = invoiceSendDate
          break
        case InvoiceAction.Pay:
          if (!payDate) {
            throw new Error('Pay date is required')
          }
          const invoicePayDate = new Date(payDate)
          if (invoicePayDate >= new Date()) {
            throw new Error('Invoice pay date must not be in the future')
          }

          const existingInvoice = await prisma.invoice.findUnique({
            where: { id: invoiceId.toString() },
            select: { sendDate: true },
          })

          if (existingInvoice?.sendDate && new Date(invoicePayDate) < new Date(existingInvoice.sendDate)) {
            throw new Error('Invoice pay date must not be before send date')
          }
          updateData.payDate = invoicePayDate
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
