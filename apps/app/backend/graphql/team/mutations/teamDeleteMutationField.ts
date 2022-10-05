import { idArg, mutationField } from 'nexus'
import { Team } from '../team'
import { isTeamMember } from '../utils'

export const teamDeleteMutationField = mutationField('teamDelete', {
  type: Team,
  description: 'Delete a new team',
  args: {
    id: idArg({ description: 'Id of the team' }),
  },
  authorize: (_source, { id }, context) => isTeamMember({ id }, context),
  resolve: (_source, { id }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
    }

    return context.prisma.team.delete({ where: { id } })
  },
})
