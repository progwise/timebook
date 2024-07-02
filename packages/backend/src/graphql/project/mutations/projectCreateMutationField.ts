import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Create a new project',
    args: {
      data: t.arg({ type: ProjectInput }),
    },
    resolve: async (query, _source, { data: { title, start, end, organizationId } }, context) => {
      if (!organizationId) {
        throw new Error('Organization ID was not provided')
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

      return prisma.project.create({
        ...query,
        data: {
          title,
          startDate: start,
          endDate: end,
          organizationId,
          projectMemberships: {
            create: {
              userId: context.session.user.id,
              role: 'ADMIN',
            },
          },
        },
      })
    },
  }),
)
