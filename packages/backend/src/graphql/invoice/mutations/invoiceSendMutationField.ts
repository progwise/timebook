import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('sendInvoice', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Send an invoice',
    args: {
      id: t.arg.id({ description: 'id of the invoice' }),
    },
    authScopes: async (_source, { id }) => ({ isAdminByTask: id.toString() }),
    resolve: (query, _source, { id }) =>
      prisma.invoice.update({
        ...query,
        where: { id: id.toString() },
        data: { sendDate: new Date() },
      }),
  }),
)
