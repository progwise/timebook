import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Team } from '../team'

export const teamArchiveMutationField = mutationField('teamArchive', {
  type: Team,
  description: 'Archive a team',
  args: {
    teamId: idArg({ description: 'id of the team' }),
  },
  authorize: (_source, _arguments, context) => isTeamAdmin(context),
  resolve: (_source, { teamId }, context) => {
    return context.prisma.team.update({
      where: { id: teamId },
      data: {
        archivedAt: new Date(),
      },
    })
  },
})
