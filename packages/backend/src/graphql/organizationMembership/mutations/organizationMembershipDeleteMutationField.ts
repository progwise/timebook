import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { isUserTheLastAdminOfOrganization } from './isUserTheLastAdminOfOrganization'

builder.mutationField('organizationMembershipDelete', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Unassign user from an organization',
    args: {
      userId: t.arg.id(),
      organizationId: t.arg.id(),
    },
    // authScopes: (_source, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { userId, organizationId }) => {
      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: { userId_organizationId: { organizationId: organizationId.toString(), userId: userId.toString() } },
      })
      if (!organizationMembership) {
        throw new Error('organization membership not found')
      }

      if (await isUserTheLastAdminOfOrganization(userId.toString(), organizationId.toString())) {
        throw new Error('Membership can not be deleted because user is the last admin')
      }

      await prisma.organizationMembership.delete({
        where: { userId_organizationId: { organizationId: organizationId.toString(), userId: userId.toString() } },
      })
      return prisma.organization.findUniqueOrThrow({ ...query, where: { id: organizationId.toString() } })
    },
  }),
)