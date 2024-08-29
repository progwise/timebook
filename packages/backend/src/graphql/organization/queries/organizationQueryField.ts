import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('organization', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Returns a single Organization',
    args: {
      organizationId: t.arg.id({ description: 'Identifier for the Organization' }),
      projectId: t.arg.id({ description: 'Identifier for the Project', required: false }),
    },
    resolve: async (query, _source, { organizationId, projectId }, context) => {
      const isOrganizationMember = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId: organizationId.toString(),
          },
        },
      })
      if (isOrganizationMember) {
        return prisma.organization.findUniqueOrThrow({
          ...query,
          where: { id: organizationId.toString() },
        })
      }

      const isProjectMember = await prisma.projectMembership.findFirst({
        where: {
          userId: context.session.user.id,
          project: {
            id: projectId?.toString(),
            organizationId: organizationId.toString(),
          },
        },
      })

      if (isProjectMember) {
        return prisma.organization.findUniqueOrThrow({
          ...query,
          where: { id: organizationId.toString() },
        })
      }

      throw new Error('Not authorized to view the organization')
    },
  }),
)
