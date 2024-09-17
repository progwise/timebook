import { builder } from '../builder'
import { prisma } from '../prisma'
import { DateScalar } from '../scalars/date'
import { RoleEnum } from './role'

export const User = builder.prismaObject('User', {
  select: { id: true },
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    projectRole: t.field({
      type: RoleEnum,
      args: { projectId: t.arg.id() },
      authScopes: (_user, { projectId }) => ({ isMemberByProject: projectId.toString() }),
      description: 'Role of the user in a project',
      resolve: async (user, { projectId }) => {
        const projectMembership = await prisma.projectMembership.findUniqueOrThrow({
          select: { projectRole: true },
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: projectId.toString(),
            },
          },
        })
        return projectMembership.projectRole
      },
    }),
    organizationRole: t.field({
      type: RoleEnum,
      args: { organizationId: t.arg.id() },
      authScopes: (_user, { organizationId }) => ({ isMemberByOrganization: organizationId.toString() }),
      description: 'Role of the user in an organization',
      resolve: async (user, { organizationId }) => {
        const organizationMembership = await prisma.organizationMembership.findUniqueOrThrow({
          select: { organizationRole: true },
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: organizationId.toString(),
            },
          },
        })
        return organizationMembership.organizationRole
      },
    }),
    durationWorkedOnProject: t.int({
      select: { id: true },
      args: {
        projectId: t.arg.id(),
        from: t.arg({ type: DateScalar }),
        to: t.arg({ type: DateScalar, required: false }),
      },
      authScopes: (_user, { projectId }) => ({ isMemberByProject: projectId.toString() }),
      resolve: async (user, { projectId, from, to }) => {
        const aggregationResult = await prisma.workHour.aggregate({
          _sum: { duration: true },
          where: {
            userId: user.id,
            task: { projectId: projectId.toString() },
            date: {
              gte: from,
              lte: to ?? from,
            },
          },
        })
        return aggregationResult._sum.duration ?? 0
      },
    }),
  }),
})
