import { builder } from '../../builder'
import { CustomerInput } from '../customerInput'
import { prisma } from '../../prisma'

builder.mutationField('customerUpdate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Customer',
    description: 'Update a customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer' }),
      data: t.arg({ type: CustomerInput }),
    },
    resolve: async (query, _source, { customerId, data }, context) => {
      const customer = await prisma.customer.findUniqueOrThrow({
        select: { id: true, team: { select: { slug: true } } },
        where: { id: customerId.toString() },
      })

      if (customer.team.slug !== context.teamSlug) {
        throw new Error('Customer not found')
      }

      return prisma.customer.update({
        ...query,
        where: { id: customer.id },
        data,
      })
    },
  }),
)
