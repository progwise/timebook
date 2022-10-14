import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('customerDelete', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Customer',
    description: 'Delete a customer',
    args: {
      customerId: t.arg.id({ description: 'Id of the customer ' }),
    },
    resolve: async (query, _source, { customerId }, context) => {
      const customer = await prisma.customer.findUniqueOrThrow({
        select: { id: true, team: { select: { slug: true } } },
        where: { id: customerId.toString() },
      })

      if (customer.team.slug !== context.teamSlug) {
        throw new Error('Customer not found')
      }

      return prisma.customer.delete({ ...query, where: { id: customer.id } })
    },
  }),
)
