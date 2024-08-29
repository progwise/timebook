import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { RoleEnum } from '../../user/role'
import { isUserTheLastAdminOfOrganization } from './isUserTheLastAdminOfOrganization'

builder.mutationField('organizationMembershipCreate', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Assign user to an organization or update the role of an existing organization member',
    args: {
      userId: t.arg.id(),
      organizationId: t.arg.id(),
      role: t.arg({ type: RoleEnum, defaultValue: 'MEMBER' }),
    },
    authScopes: (_, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { userId, organizationId, role }) => {
      if (role === 'MEMBER' && (await isUserTheLastAdminOfOrganization(userId.toString(), organizationId.toString()))) {
        throw new Error('Membership can not be changed because user is the last admin')
      }

      const organizationMembership = await prisma.organizationMembership.upsert({
        select: { organization: query },
        where: { userId_organizationId: { userId: userId.toString(), organizationId: organizationId.toString() } },
        create: {
          userId: userId.toString(),
          organizationId: organizationId.toString(),
          role: role,
        },
        update: { role },
      })

      return organizationMembership.organization
    },
  }),
)
