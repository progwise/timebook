import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceItemUpdateInput } from '../invoiceItemUpdateInput'

builder.mutationField('invoiceItemUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'InvoiceItem',
    description: 'Update an invoice item',
    args: {
      id: t.arg.id({ description: 'id of the invoice item' }),
      data: t.arg({ type: InvoiceItemUpdateInput }),
    },
    authScopes: async (_source, { data: { organizationId } }) => ({
      isAdminByOrganization: organizationId?.toString(),
    }),
    resolve: async (query, _source, { id, data: { duration, hourlyRate } }) => {
      return prisma.invoiceItem.update({
        ...query,
        where: { id: id.toString() },
        data: {
          duration: duration ?? undefined,
          hourlyRate: hourlyRate ?? undefined,
        },
      })
    },
  }),
)
