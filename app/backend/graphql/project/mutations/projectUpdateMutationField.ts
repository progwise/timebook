import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectUpdate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Project',
    description: 'Update a project',
    args: {
      id: t.arg.id({ description: 'id of the project' }),
      data: t.arg({ type: ProjectInput }),
    },

    resolve: async (query, _source, { id, data: { title, start, end, customerId } }, context) => {
      const team = await prisma.team.findUniqueOrThrow({ where: { slug: context.teamSlug } })

      const project = await prisma.project.findUniqueOrThrow({
        where: { id: id.toString() },
      })

      if (project.teamId !== team.id) {
        // Project is from different team
        throw new Error('not authenticated')
      }

      if (customerId) {
        const newCustomer = await prisma.customer.findFirst({ where: { id: customerId.toString() } })

        if (!newCustomer || newCustomer.teamId !== team.id) {
          throw new Error('Customer not found')
        }
      }

      return prisma.project.update({
        ...query,
        where: { id: id.toString() },
        data: {
          title,
          startDate: start,
          endDate: end,
          // eslint-disable-next-line unicorn/no-null
          customerId: customerId?.toString() ?? null,
        },
      })
    },
  }),
)
