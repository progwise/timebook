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
    authScopes: async (_source, { id, data: {} }) => {
      const invoiceItem = await prisma.invoiceItem.findUniqueOrThrow({
        select: { invoice: { select: { organization: { select: { id: true } } } } },
        where: { id: id.toString() },
      })

      return { isAdminByOrganization: invoiceItem.invoice.organization.id }
    },
    resolve: async (query, _source, { id, data: { taskId, invoiceId, duration, hourlyRate } }) => {
      return prisma.invoiceItem.update({
        ...query,
        where: { id: id.toString() },
        data: {
          taskId: taskId?.toString(),
          invoiceId: invoiceId?.toString(),
          duration: duration ?? undefined,
          hourlyRate: hourlyRate ?? undefined,
        },
      })
    },
  }),
)
