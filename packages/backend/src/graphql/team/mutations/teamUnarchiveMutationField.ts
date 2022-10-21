import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('teamUnarchive', (t) =>
  t.prismaField({
    type: 'Team',
    description: 'Unarchive a team',
    args: {
      teamId: t.arg.id({ description: 'Id of the team' }),
    },
    authScopes: (_source, { teamId }) => ({ isTeamAdminByTeamId: teamId.toString() }),
    resolve: async (query, _source, { teamId }) =>
      prisma.team.update({
        ...query,
        where: {
          id: teamId.toString(),
        },
        data: {
          // eslint-disable-next-line unicorn/no-null
          archivedAt: null,
        },
      }),
  }),
)
