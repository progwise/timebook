import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectUpdate', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Update a project',
    args: {
      id: t.arg.id({ description: 'id of the project' }),
      data: t.arg({ type: ProjectInput }),
    },
    authScopes: async (_source, { id }) => ({ isAdminByProject: id.toString() }),
    resolve: async (query, _source, { id, data: { title, start, end, organizationId } }, context) => {
      if (!organizationId) {
        throw new Error('Organization ID was not provided')
      }

      if (!context.session) {
        throw new Error('Not authenticated')
      }

      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId,
          },
        },
      })

      if (!organizationMembership) {
        throw new Error('User is not a member of the organization')
      }
      return prisma.project.update({
        ...query,
        where: { id: id.toString() },
        data: {
          title,
          startDate: start,
          endDate: end,
          organizationId,
        },
      })
    },
  }),
)
