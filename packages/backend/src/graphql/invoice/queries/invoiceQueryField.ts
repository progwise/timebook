import { startOfMonth, endOfMonth } from 'date-fns'
import { builder } from '../../builder'
import { prisma } from '../../prisma'


builder.queryField('invoices',(t) =>
t.prismaField({
    type: ['Invoice'],
    description: 'Invoice for a project',
    
      resolve: (_source, _) => prisma.invoice.findMany(),
}),
)