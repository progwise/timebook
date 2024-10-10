import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { getWhereUserIsMember } from '../project/queries/getWhereUserIsMember'

export const Organization = builder.prismaObject('Organization', {
  select: { id: true },
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the organization' }),
    title: t.exposeString('title'),
    address: t.exposeString('address', {
      nullable: true,
    }),
    projects: t.withAuth({ isLoggedIn: true }).relation('projects', {
      query: (_arguments, context) => ({ where: getWhereUserIsMember(context.session.user.id) }),
    }),
    isArchived: t.boolean({
      select: { archivedAt: true },
      resolve: (organization) => !!organization.archivedAt,
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { id: true },
      resolve: async (organization, _arguments, context) => {
        const organizationMembership = await prisma.organizationMembership.findUnique({
          select: { organizationRole: true },
          where: { userId_organizationId: { organizationId: organization.id, userId: context.session.user.id } },
        })

        return organizationMembership?.organizationRole === 'ADMIN'
      },
    }),
    members: t.prismaField({
      description: 'List of users that are member of the organization',
      select: { id: true },
      authScopes: (organization) => ({ isMemberByOrganization: organization.id }),
      type: ['User'],
      resolve: (query, organization) =>
        prisma.user.findMany({
          ...query,
          where: { organizationMemberships: { some: { organizationId: organization.id } } },
          orderBy: { name: 'asc' },
        }),
    }),
    subscriptionStatus: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Is subscription active or inactive',
      select: { subscriptionStatus: true },
      resolve: (organization) => organization.subscriptionStatus,
    }),
    subscriptionExpiresAt: t.withAuth({ isLoggedIn: true }).field({
      type: 'DateTime',
      nullable: true,
      description: 'Date when the current subscription expires',
      select: { subscriptionExpiresAt: true },
      resolve: (organization) => organization.subscriptionExpiresAt,
    }),
  }),
})
