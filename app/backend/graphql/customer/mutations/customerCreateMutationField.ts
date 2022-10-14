import { builder } from '../../builder'
import { CustomerInput } from '../customerInput'
import { prisma } from '../../prisma'

builder.mutationField('customerCreate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Customer',
    description: 'Create a new customer for a team',
    args: {
      data: t.arg({ type: CustomerInput }),
    },
    resolve: (query, _source, { data: { title } }, context) =>
      prisma.customer.create({
        ...query,
        data: { title, team: { connect: { slug: context.teamSlug } } },
      }),
  }),
)
