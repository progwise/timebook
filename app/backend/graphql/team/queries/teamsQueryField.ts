import { list, queryField } from 'nexus'
import { Team } from '../team'

export const teamsQueryField = queryField('teams', {
  type: list(Team),
  description: 'Return all teams',
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) => {
    if (!context.session?.user) {
      throw new Error('User not authenticated')
    }

    return context.prisma.team.findMany({
      where: {
        teamMemberships: { some: { userId: context.session.user.id } },
      },
    })
  },
})
