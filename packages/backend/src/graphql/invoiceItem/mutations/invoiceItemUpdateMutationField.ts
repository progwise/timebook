import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceItemInput } from '../invoiceItemInput'

builder.mutationField('invoiceItemUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'InvoiceItem',
    description: 'Update an invoice item',
    args: {
      id: t.arg.id({ description: 'id of the invoice item' }),
      data: t.arg({ type: InvoiceItemInput }),
    },
    authScopes: (_source, { data: { taskId } }) => ({ isAdminByTask: taskId.toString() }),
    resolve: async (query, _source, { id, data: { duration, hourlyRate, taskId } }) => {
      return prisma.invoiceItem.update({
        ...query,
        data: {
          duration,
          hourlyRate,
          taskId: taskId.toString(),
        },
        where: { id: id.toString() },
      })
    },
  }),
)
