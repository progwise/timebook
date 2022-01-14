import { objectType } from 'nexus'
import { Project } from '../project'

export const Customer = objectType({
  name: 'Customer',
  definition: (t) => {
    t.id('id', { description: 'Identifier of the customer' })
    t.string('title', { description: 'Title of the customer' })
    t.list.field('projects', {
      type: Project,
      description: 'List of all customer projects',
      resolve: (customer, _arguments, context) =>
        context.prisma.project.findMany({
          where: {
            customerId: customer.id,
          },
        }),
    })
  },
})
