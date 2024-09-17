import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { RoleEnum } from '../../user/role'
import { isUserTheLastAdminOfOrganization } from './isUserTheLastAdminOfOrganization'

builder.mutationField('organizationMembershipCreate', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Assign user to an organization',
    args: {
      userId: t.arg.id(),
      organizationId: t.arg.id(),
      organizationRole: t.arg({ type: RoleEnum, defaultValue: 'MEMBER' }),
    },
    authScopes: (_, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { userId, organizationId, organizationRole }) => {
      if (
        organizationRole === 'MEMBER' &&
        (await isUserTheLastAdminOfOrganization(userId.toString(), organizationId.toString()))
      ) {
        throw new Error('Cannot remove the last admin of an organization')
      }

      const organizationMembership = await prisma.organizationMembership.upsert({
        select: { organization: query },
        where: { userId_organizationId: { userId: userId.toString(), organizationId: organizationId.toString() } },
        create: {
          userId: userId.toString(),
          organizationId: organizationId.toString(),
          organizationRole: organizationRole,
        },
        update: { organizationRole },
      })

      return organizationMembership.organization
    },
  }),
)
