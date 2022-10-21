import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('teamArchive', (t) =>
  t.prismaField({
    type: 'Team',
    description: 'Archive a team',
    args: {
      teamId: t.arg.id({ description: 'id of the team' }),
    },
    authScopes: (_source, { teamId }) => ({ isTeamAdminByTeamId: teamId.toString() }),
    resolve: async (query, _source, { teamId }) =>
      prisma.team.update({
        ...query,
        where: {
          id: teamId.toString(),
        },
        data: {
          archivedAt: new Date(),
        },
      }),
  }),
)
