import { booleanArg, list, queryField } from 'nexus'
import { Team } from '../team'

export const teamsQueryField = queryField('teams', {
  type: list(Team),
  description: 'Return all teams',
  args: {
    includeArchived: booleanArg({
      default: false,
      description: 'Show archived teams',
    }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: async (_source, { includeArchived }, context) => {
    if (!context.session?.user) {
      throw new Error('User not authenticated')
    }

    return context.prisma.team.findMany({
      where: {
        teamMemberships: { some: { userId: context.session.user.id } },
        // eslint-disable-next-line unicorn/no-null
        archivedAt: includeArchived ? undefined : null,
      },
      orderBy: [{ archivedAt: 'desc' }, { title: 'asc' }],
    })
  },
})
