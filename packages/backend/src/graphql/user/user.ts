import { GraphQLError } from 'graphql'

import { builder } from '../builder'
import { prisma } from '../prisma'
import { RoleEnum } from './role'

export const User = builder.prismaObject('User', {
  select: { id: true },
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    projects: t.prismaField({
      type: ['Project'],
      description: 'Returns the list of projects where the user is a member',
      args: { teamSlug: t.arg.string() },
      authScopes: (_user, { teamSlug }) => ({ isTeamMemberByTeamSlug: teamSlug }),
      resolve: (query, user, { teamSlug }) =>
        prisma.project.findMany({
          ...query,
          where: {
            team: { slug: teamSlug },
            projectMemberships: { some: { userId: user.id } },
          },
        }),
    }),
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

        if (!slug) {
          throw new GraphQLError('Team slug is missing.')
        }

        const membership = await prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: user.id,
            team: { slug },
          },
        })

        return membership.availableMinutesPerWeek
      },
    }),
  }),
})
