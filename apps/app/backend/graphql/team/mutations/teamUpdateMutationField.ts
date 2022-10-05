import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Team } from '../team'
import { TeamInput } from '../teamInput'

export const teamUpdateMutationField = mutationField('teamUpdate', {
  type: Team,
  description: 'Update a new team',
  args: {
    id: idArg({ description: 'Id of the team' }),
    data: TeamInput,
  },
  authorize: (_source, _arguments, context) => isTeamAdmin(context),

  resolve: async (_source, { id, data: { title, slug, theme } }, context) => {
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
