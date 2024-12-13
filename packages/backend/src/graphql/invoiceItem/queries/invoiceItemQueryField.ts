import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('invoiceItems', (t) =>
  t.prismaField({
    type: ['InvoiceItem'],
    description: 'Returns a list of invoice items for a given invoice',
    args: {
      invoiceId: t.arg.id({ description: 'Identifier for the invoice' }),
    },
    resolve: (query, _source, { invoiceId }) =>
      prisma.invoiceItem.findMany({
        ...query,
        where: { invoiceId: invoiceId.toString() },
        orderBy: { start: 'asc' },
      }),
  }),
)
