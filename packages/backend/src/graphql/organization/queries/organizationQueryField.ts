import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('organization', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Returns a single Organization',
    args: {
      organizationId: t.arg.id({ description: 'Identifier for the Organization' }),
    },
    authScopes: (_source, { organizationId }) => ({
      isMemberByOrganization: organizationId.toString(),
    }),
    resolve: (query, _source, { organizationId }) =>
      prisma.organization.findUniqueOrThrow({
        ...query,
        where: { id: organizationId.toString() },
      }),
  }),
)
