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
    payDate: t.expose('payDate', { type: 'Date', nullable: true }),
    sendDate: t.expose('sendDate', { type: 'Date', nullable: true }),

    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { organizationId: true },
      resolve: async (invoice, _arguments, context) => {
        const organizationMembership = await prisma.organizationMembership.findUnique({
          select: { organizationRole: true },
          where: { userId_organizationId: { organizationId: invoice.organizationId, userId: context.session.user.id } },
        })

        return organizationMembership?.organizationRole === 'ADMIN'
      },
    }),

    organization: t.relation('organization'),
    invoiceItems: t.relation('InvoiceItems', {
      description: 'Items associated with the invoice',
      resolve: (query, invoice) => {
        return prisma.invoiceItem.findMany({ ...query, where: { invoiceId: invoice.id }, orderBy: { start: 'asc' } })
      },
    }),
  }),
})
