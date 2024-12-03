import { builder } from '../builder'
import { prisma } from '../prisma'

export const InvoiceItem = builder.prismaObject('InvoiceItem', {
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifies the invoice item' }),
    start: t.expose('start', { type: 'DateTime', nullable: true }),
    end: t.expose('end', { type: 'DateTime', nullable: true }),
    duration: t.exposeInt('duration', { description: 'Duration of the invoice item in minutes' }),
    hourlyRate: t.expose('hourlyRate', {
      type: 'Decimal',
      description: 'Hourly rate for the invoice item',
      nullable: true,
    }),
    invoice: t.relation('invoice', {
      description: 'Invoice to which the invoice item belongs',
      resolve: async (query, invoiceItem) => {
        return await prisma.invoice.findUniqueOrThrow({ ...query, where: { id: invoiceItem.invoiceId } })
      },
    }),
    task: t.relation('task', { description: 'Task for which the invoice item was booked' }),
  }),
})
