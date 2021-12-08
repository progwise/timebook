import { idArg, queryField } from 'nexus'
import { Team } from '../team'
import { isTeamMember } from '../utils'

export const teamQueryField = queryField('team', {
  type: Team,
  description: 'Return a team by an id',
  args: {
    id: idArg({ description: 'Id of the team' }),
  },
  authorize: (_source, { id }, context) => isTeamMember({ id }, context),
  resolve: (_source, { id }, context) =>
    context.prisma.team.findUnique({
      where: { id },
      rejectOnNotFound: true,
    }),
})
