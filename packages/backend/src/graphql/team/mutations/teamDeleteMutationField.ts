import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('teamDelete', (t) =>
  t.prismaField({
    type: 'Team',
    description: 'Delete a team',
    args: {
      id: t.arg.id({ description: 'Id of the team' }),
    },
    authScopes: (_source, { id }) => ({ isTeamAdminByTeamId: id.toString() }),
    resolve: async (query, _source, { id }) =>
      prisma.team.delete({
        ...query,
        where: { id: id.toString() },
      }),
  }),
)
