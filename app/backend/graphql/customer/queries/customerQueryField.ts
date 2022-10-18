import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('customer', (t) =>
  t.prismaField({
    type: 'Customer',
    description: 'Returns a single customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer' }),
    },
    authScopes: async (_source, { customerId }) => {
      const customer = await prisma.customer.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: customerId.toString() },
      })

      return { isTeamMemberByTeamId: customer.teamId }
    },
    resolve: (query, _source, { customerId }) =>
      prisma.customer.findUniqueOrThrow({
        ...query,
        where: { id: customerId.toString() },
      }),
  }),
)
