import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('organizations', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Organization'],
    description: 'Returns all organizations of the signed in user that are active',
    args: {
      includeArchived: t.arg.boolean({ required: false }),
    },
    resolve: (query, _source, { includeArchived }, context) =>
      prisma.organization.findMany({
        ...query,
        where: {
          organizationMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
          archivedAt: includeArchived ? undefined : null,
        },
        orderBy: { title: 'asc' },
      }),
  }),
)
