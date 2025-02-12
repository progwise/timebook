import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('invoiceItemDelete', (t) =>
  t.prismaField({
    type: 'InvoiceItem',
    description: 'Delete an invoice item',
    args: {
      invoiceItemId: t.arg.id({ description: 'ID of the invoice item' }),
      organizationId: t.arg.id({ description: 'ID of the organization' }),
    },
    authScopes: (_source, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { invoiceItemId }) => {
      return prisma.invoiceItem.delete({
        ...query,
        where: { id: invoiceItemId.toString() },
      })
    },
  }),
)
