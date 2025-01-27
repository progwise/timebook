import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceSendInput } from '../invoiceSendInput'

builder.mutationField('sendInvoice', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Send an invoice',
    args: {
      data: t.arg({ type: InvoiceSendInput }),
    },
    authScopes: async (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId.toString() }),

    resolve: (query, _source, { data: { id } }) =>
      prisma.invoice.update({
        ...query,
        data: { invoiceStatus: 'SENT', sendDate: new Date() },
        where: { id: id.toString() },
      }),
  }),
)
