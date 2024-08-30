import { Role } from '@progwise/timebook-prisma'

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
    role: t.field({
      type: RoleEnum,
      args: {
        projectId: t.arg.id({ required: false }),
        organizationId: t.arg.id({ required: false }),
      },
      authScopes: (_user, { projectId, organizationId }) => {
        if (projectId) {
          return { isMemberByProject: projectId.toString() }
        }
        if (organizationId) {
          return { isAdminByOrganization: organizationId.toString() }
        }
        return { isLoggedIn: true }
      },
      description: 'Role of the user in a project or organization',
      resolve: async (user, { projectId, organizationId }) => {
        if (projectId) {
          const projectMembership = await prisma.projectMembership.findUnique({
            select: { role: true },
            where: {
              userId_projectId: {
                userId: user.id,
                projectId: projectId.toString(),
              },
            },
          })
          return projectMembership?.role ?? Role.MEMBER
        }

        if (organizationId) {
          const organizationMembership = await prisma.organizationMembership.findUnique({
            select: { role: true },
            where: {
              userId_organizationId: {
                userId: user.id,
                organizationId: organizationId.toString(),
              },
            },
          })
          return organizationMembership?.role ?? Role.MEMBER
        }

        return Role.MEMBER
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
