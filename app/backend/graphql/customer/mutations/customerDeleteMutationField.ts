import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('customerDelete', (t) =>
  t.prismaField({
    type: 'Customer',
    description: 'Delete a customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer ' }),
    },
    authScopes: async (_source, { customerId }) => {
      const customer = await prisma.customer.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: customerId.toString() },
      })
      return { isTeamAdminByTeamId: customer.teamId }
    },
    resolve: (query, _source, { customerId }) =>
      prisma.customer.delete({ ...query, where: { id: customerId.toString() } }),
  }),
)
