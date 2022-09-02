import { idArg, mutationField } from 'nexus'
import { Team } from '../team'

export const teamArchiveMutationField = mutationField('teamArchive', {
  type: Team,
  description: 'Archive a team',
  args: {
    teamId: idArg({ description: 'id of the team' }),
  },
  authorize: async (_source, { teamId }, context) => {
    const userId = context.session?.user.id

    if (!userId) {
      return false
    }

    const teamMembership = await context.prisma.teamMembership.findFirst({
      where: {
        teamId,
        userId,
      },
    })

    return teamMembership?.role === 'ADMIN'
  },
  resolve: (_source, { teamId }, context) => {
    return context.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        archivedAt: new Date(),
      },
    })
  },
})
