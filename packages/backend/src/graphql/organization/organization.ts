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
    role: t.withAuth({ isLoggedIn: true }).string({
      description: 'Role of the user in the organization or its projects',
      select: { id: true },
      resolve: async (organization, _arguments, context) => {
        const organizationMembership = await prisma.organizationMembership.findUnique({
          select: { role: true },
          where: { userId_organizationId: { organizationId: organization.id, userId: context.session.user.id } },
        })

        if (organizationMembership?.role === 'ADMIN') {
          return 'ADMIN'
        }

        const projectMembership = await prisma.projectMembership.findFirst({
          where: {
            userId: context.session.user.id,
            project: { organizationId: organization.id },
          },
        })

        return projectMembership ? 'MEMBER' : 'NONE'
      },
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { id: true },
      resolve: async (organization, _arguments, context) => {
        const organizationMembership = await prisma.organizationMembership.findUnique({
          select: { role: true },
          where: { userId_organizationId: { organizationId: organization.id, userId: context.session.user.id } },
        })

        return organizationMembership?.role === 'ADMIN'
      },
    }),
    members: t.prismaField({
      description: 'List of users that are member of the organization',
      select: { id: true },
      authScopes: (organization) => ({ isMemberByOrganization: organization.id }),
      type: ['User'],
      args: {
        includeProjectMembers: t.arg.boolean({
          defaultValue: false,
          description:
            'Set this to true if you want to also see the users who are members of projects in the organization',
        }),
      },
      resolve: (query, organization, { includeProjectMembers }) =>
        prisma.user.findMany({
          ...query,
          where: includeProjectMembers
            ? {
                OR: [
                  { organizationMemberships: { some: { organizationId: organization.id } } },
                  { projectMemberships: { some: { project: { organizationId: organization.id } } } },
                ],
              }
            : {
                organizationMemberships: { some: { organizationId: organization.id } },
              },
          orderBy: { name: 'asc' },
        }),
    }),
  }),
})
