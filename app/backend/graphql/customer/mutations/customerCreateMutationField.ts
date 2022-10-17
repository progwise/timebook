import { builder } from '../../builder'
import { CustomerInput } from '../customerInput'
import { prisma } from '../../prisma'

builder.mutationField('customerCreate', (t) =>
  t.prismaField({
    type: 'Customer',
    description: 'Create a new customer for a team',
    authScopes: (_source, { teamSlug }) => ({ isTeamAdminByTeamSlug: teamSlug }),
    args: {
      data: t.arg({ type: CustomerInput }),
      teamSlug: t.arg.string({ description: 'slug of the team' }),
    },
    resolve: (query, _source, { data: { title }, teamSlug }) =>
      prisma.customer.create({
        ...query,
        data: { title, team: { connect: { slug: teamSlug } } },
      }),
  }),
)
