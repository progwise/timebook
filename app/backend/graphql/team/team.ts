import { builder } from '../builder'
import { Theme } from './theme'
import { User } from '../user/user'
import { ModifyInterface } from '../interfaces/modifyInterface'

export const Team = builder.prismaObject('Team', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifier of the team' }),
    title: t.exposeString('title', { description: 'Title of the team' }),
    slug: t.exposeString('slug', { description: 'Slug that is used in the team URL' }),
    archived: t.boolean({ resolve: (team) => !!team.archivedAt, select: { archivedAt: true } }),
    inviteKey: t.exposeString('inviteKey'),
    theme: t.expose('theme', { type: Theme, description: 'Color theme of the team' }),
    members: t.field({
      type: [User],
      description: 'All members of the team',
      select: {
        teamMemberships: {
          select: {
            user: true,
          },
        },
      },
      resolve: (project) => project.teamMemberships.map((teamMembership) => teamMembership.user),
    }),
    customers: t.relation('customers', { description: 'List of all customers of the team' }),
    projects: t.withAuth({ isLoggedIn: true }).relation('projects', {
      description: 'List of all projects of the team',
      query: (_arguments, context) => ({
        where: {
          OR: {
            projectMemberships: { some: { userId: context.session.user.id } },
            team: { teamMemberships: { some: { role: 'ADMIN', userId: context.session.user.id } } },
          },
        },
      }),
    }),
  }),
})
