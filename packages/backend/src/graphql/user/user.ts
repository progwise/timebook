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
      args: { teamSlug: t.arg.string() },
      select: { id: true },
      authScopes: (_user, { teamSlug }) => ({ isTeamMemberByTeamSlug: teamSlug }),
      description: 'Role of the user in a team',
      resolve: async (user, { teamSlug }) => {
        const teamMembership = await prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: user.id,
            team: { slug: teamSlug },
          },
        })
        return teamMembership.role
      },
    }),
    availableMinutesPerWeek: t.field({
      type: 'Int',
      nullable: true,
      args: { teamSlug: t.arg.string() },
      select: { id: true },
      authScopes: (_user, { teamSlug }) => ({ isTeamMemberByTeamSlug: teamSlug }),
      description: 'Capacity of the user in the team',
      resolve: async (user, _arguments) => {
        const slug = _arguments.teamSlug

        const membership = await prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: user.id,
            team: { slug },
          },
        })

        return membership.availableMinutesPerWeek
      },
    }),
    durationWorkedOnProject: t.int({
      select: { id: true },
      args: {
        projectId: t.arg.id(),
        from: t.arg({ type: DateScalar }),
        to: t.arg({ type: DateScalar, required: false }),
      },
      authScopes: (_user, { projectId }) => ({ isProjectMember: projectId.toString() }),
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
