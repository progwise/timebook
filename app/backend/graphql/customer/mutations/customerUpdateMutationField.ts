import { builder } from '../../builder'
import { CustomerInput } from '../customerInput'
import { prisma } from '../../prisma'

builder.mutationField('customerUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Customer',
    description: 'Update a customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer' }),
      data: t.arg({ type: CustomerInput }),
    },
    authScopes: async (_source, { customerId }) => {
      const customer = await prisma.customer.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: customerId.toString() },
      })

      return { isTeamAdminByTeamId: customer.teamId }
    },
    resolve: (query, _source, { customerId, data }) =>
      prisma.customer.update({
        ...query,
        where: { id: customerId.toString() },
        data,
      }),
  }),
)
