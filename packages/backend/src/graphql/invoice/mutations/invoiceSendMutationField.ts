import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceSendInput } from '../invoiceSendInput'

builder.mutationField('invoiceSend', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Send an invoice',
    args: {
      data: t.arg({ type: InvoiceSendInput }),
    },
    authScopes: async (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId.toString() }),

    resolve: (query, _source, { data: { invoiceId, sendDate } }) => {
      if (!sendDate) {
        throw new Error('Send date is required')
      }
      const invoiceSendDate = new Date(sendDate)
      if (invoiceSendDate >= new Date()) {
        throw new Error('Invoice send date must not be in the future')
      }
      return prisma.invoice.update({
        ...query,
        data: { invoiceStatus: 'SENT', sendDate: invoiceSendDate },
        where: { id: invoiceId.toString() },
      })
    },
  }),
)
