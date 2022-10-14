import { builder } from '../builder'
import { prisma } from '../prisma'
import { RoleEnum } from './role'

export const User = builder.prismaObject('User', {
  select: { id: true },
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    projects: t.withAuth({ isTeamMember: true }).prismaField({
      type: ['Project'],
      description: 'Returns the list of projects where the user is a member',
      resolve: (query, user, _arguments, context) =>
        prisma.project.findMany({
          ...query,
          where: {
            team: { slug: context.teamSlug },
            projectMemberships: { some: { userId: user.id } },
          },
        }),
    }),
    role: t.withAuth({ isTeamMember: true }).field({
      type: RoleEnum,
      description: 'Role of the user in the current team',
      resolve: async (user, _arguments, context) => {
        const teamMembership = await prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: context.session.user.id,
            team: { slug: context.teamSlug },
          },
        })
        return teamMembership.role
      },
    }),
  }),
})
