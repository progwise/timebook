import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('organizationMembershipCreate', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Assign user to an organization',
    args: {
      userId: t.arg.id(),
      organizationId: t.arg.id(),
    },
    authScopes: (_, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { userId, organizationId }) => {
      const organizationMembership = await prisma.organizationMembership.upsert({
        select: { organization: query },
        where: { userId_organizationId: { userId: userId.toString(), organizationId: organizationId.toString() } },
        create: {
          userId: userId.toString(),
          organizationId: organizationId.toString(),
          role: 'ADMIN',
        },
        update: { role: 'ADMIN' },
      })

      return organizationMembership.organization
    },
  }),
)
