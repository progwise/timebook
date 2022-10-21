import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TeamInput } from '../teamInput'

builder.mutationField('teamUpdate', (t) =>
  t.prismaField({
    type: 'Team',
    description: 'Update a team',
    args: {
      id: t.arg.id({ description: 'Id of the team' }),
      data: t.arg({ type: TeamInput }),
    },
    authScopes: (_source, { id }) => ({ isTeamAdminByTeamId: id.toString() }),
    resolve: async (query, _source, { id, data: { title, slug, theme } }) =>
      prisma.team.update({
        ...query,
        where: { id: id.toString() },
        data: {
          title,
          slug,
          theme: theme ?? undefined,
        },
      }),
  }),
)
