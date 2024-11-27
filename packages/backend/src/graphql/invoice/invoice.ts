import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'

export const Invoice = builder.prismaObject('Invoice', {
  select: { id: true },
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the invoice' }),
    invoiceDate: t.expose('invoiceDate', { type: 'Date' }),
    customerAddress: t.exposeString('customerAddress', { nullable: true }),
    customerName: t.exposeString('customerName'),
    organization: t.relation('organization'),
    items: t.relation('InvoiceItems', {
      description: 'Items associated with the invoice',
      resolve: (query, invoice) => {
        return prisma.invoiceItem.findMany({ ...query, where: { invoiceId: invoice.id }, orderBy: { start: 'asc' } })
      },
    }),
  }),
})
