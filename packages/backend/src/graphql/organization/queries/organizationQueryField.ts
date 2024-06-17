import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('organization', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Returns a single Organization',
    args: {
      organizationId: t.arg.id({ description: 'Identifier for the Organization' }),
    },
    resolve: (query, _source, { organizationId }, context) =>
      prisma.organization.findUniqueOrThrow({
        ...query,
        where: {
          id: organizationId.toString(),
          organizationMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
      }),
  }),
)
