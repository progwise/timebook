import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Update a project',
    args: {
      id: t.arg.id({ description: 'id of the project' }),
      data: t.arg({ type: ProjectInput }),
    },
    authScopes: async (_source, { id }) => {
      const project = await prisma.project.findUniqueOrThrow({ select: { teamId: true }, where: { id: id.toString() } })
      return { isTeamAdminByTeamId: project.teamId }
    },

    resolve: async (query, _source, { id, data: { title, start, end, customerId } }) => {
      const project = await prisma.project.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: id.toString() },
      })

      if (customerId) {
        const newCustomer = await prisma.customer.findFirst({
          select: { teamId: true },
          where: { id: customerId.toString() },
        })

        if (!newCustomer || newCustomer.teamId !== project.teamId) {
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
