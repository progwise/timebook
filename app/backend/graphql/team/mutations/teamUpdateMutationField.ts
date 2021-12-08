import { arg, idArg, mutationField } from 'nexus'
import { Team } from '../team'
import { TeamInput } from '../teamInput'
import { isTeamMember } from '../utils'

export const teamUpdateMutationField = mutationField('teamUpdate', {
  type: Team,
  description: 'Update a new team',
  args: {
    id: idArg({ description: 'Id of the team' }),
    data: arg({ type: TeamInput }),
  },
  authorize: async (_source, { id }, context) => isTeamMember({ id }, context),
  resolve: (_source, { id, data: { title, slug, theme } }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
    }

    return context.prisma.team.update({
      where: { id },
      data: {
        title,
        slug,
        theme: theme ?? undefined,
      },
    })
  },
})
