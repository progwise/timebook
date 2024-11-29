import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { getWhereUserIsMember } from '../project/queries/getWhereUserIsMember'
import { SubscriptionStatus, SubscriptionStatusEnum } from './organizationSubscriptionStatusEnum'

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
    subscriptionExpiresAt: t.expose('subscriptionExpiresAt', {
      type: 'DateTime',
      nullable: true,
      description: 'Date when the current subscription expires',
    }),
    paypalSubscriptionId: t.exposeString('paypalSubscriptionId', { nullable: true }),
    subscriptionStatus: t.field({
      type: SubscriptionStatusEnum,
      nullable: true,
      description: 'Status of the subscription',
      select: { subscriptionStatus: true },
      resolve: (organization) => {
        switch (organization.subscriptionStatus) {
          case 'ACTIVE':
            return SubscriptionStatus.ACTIVE
          case 'CANCELLED':
            return SubscriptionStatus.CANCELLED
        }
      },
    }),
    invoices: t.prismaField({
      description: 'List of invoices associated with the organization',
      select: { id: true },
      authScopes: (organization) => ({ isAdminByOrganization: organization.id }),
      type: ['Invoice'],
      resolve: (query, organization) =>
        prisma.invoice.findMany({
          ...query,
          where: { organizationId: organization.id },
          orderBy: { invoiceDate: 'asc' },
        }),
    }),
  }),
})
