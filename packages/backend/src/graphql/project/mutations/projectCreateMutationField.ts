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
    authScopes: (_source, { data: { organizationId } }) => {
      return !organizationId || { isAdminByOrganization: organizationId?.toString() }
    },
    resolve: async (query, _source, { data: { title, start, end, organizationId } }, context) => {
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
