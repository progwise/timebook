import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('teams', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Team'],
    description: 'Return all teams',
    args: {
      includeArchived: t.arg.boolean({
        defaultValue: false,
        description: 'Show archived teams',
      }),
    },
    resolve: (query, _root, { includeArchived }, context) =>
      prisma.team.findMany({
        ...query,
        where: {
          teamMemberships: { some: { userId: context.session.user.id } },
          // eslint-disable-next-line unicorn/no-null
          archivedAt: includeArchived ? undefined : null,
        },
        orderBy: [{ archivedAt: 'desc' }, { title: 'asc' }],
      }),
  }),
)
