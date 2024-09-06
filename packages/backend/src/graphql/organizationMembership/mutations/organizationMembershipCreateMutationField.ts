import { builder } from '../../builder'
import { prisma } from '../../prisma'

// import { RoleEnum } from '../../user/role'
// import { isUserTheLastAdminOfOrganization } from './isUserTheLastAdminOfOrganization'

builder.mutationField('organizationMembershipCreate', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Assign user to an organization',
    args: {
      userId: t.arg.id(),
      organizationId: t.arg.id(),
      // role: t.arg({ type: RoleEnum, defaultValue: 'ADMIN' }),
    },
    authScopes: (_, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, { userId, organizationId }) => {
      // if (role === 'ADMIN' && (await isUserTheLastAdminOfOrganization(userId.toString(), organizationId.toString()))) {
      //   throw new Error('Membership cannot be changed because user is the last admin')
      // }

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
