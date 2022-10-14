import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('customer', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'Customer',
    description: 'Returns a single customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer' }),
    },
    resolve: (query, _source, { customerId }, context) =>
      prisma.customer.findFirstOrThrow({
        ...query,
        where: {
          id: customerId.toString(),
          team: { slug: context.teamSlug },
        },
      }),
  }),
)
