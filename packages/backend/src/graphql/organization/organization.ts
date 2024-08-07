import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'

export const Organization = builder.prismaObject('Organization', {
  select: { id: true },
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the organization' }),
    title: t.exposeString('title'),
    address: t.exposeString('address', {
      authScopes: (organization) => ({ isAdminByOrganization: organization.id }),
      nullable: true,
    }),
    projects: t.relation('projects', { authScopes: (organization) => ({ isAdminByOrganization: organization.id }) }),
    isArchived: t.boolean({
      select: { archivedAt: true },
      resolve: (organization) => !!organization.archivedAt,
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { id: true },
      resolve: async (organization, _arguments, context) => {
        const organizationMembership = await prisma.organizationMembership.findUnique({
          where: { userId_organizationId: { organizationId: organization.id, userId: context.session.user.id } },
        })

        return !!organizationMembership
      },
    }),
  }),
})
