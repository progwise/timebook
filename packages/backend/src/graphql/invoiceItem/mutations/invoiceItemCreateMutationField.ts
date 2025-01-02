import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceItemInput } from '../invoiceItemInput'

builder.mutationField('invoiceItemCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'InvoiceItem',
    description: 'Create a new invoice item',
    args: {
      data: t.arg({ type: InvoiceItemInput }),
    },
    authScopes: (_source, { data: { taskId } }) => ({ isAdminByTask: taskId.toString() }),
    resolve: async (query, _source, { data: { duration, hourlyRate, invoiceId, taskId } }) => {
      return prisma.invoiceItem.create({
        ...query,
        data: {
          duration,
          hourlyRate,
          invoiceId: invoiceId.toString(),
          taskId: taskId.toString(),
        },
      })
    },
  }),
)
