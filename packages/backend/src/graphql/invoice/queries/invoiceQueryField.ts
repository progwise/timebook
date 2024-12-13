import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('invoice', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Invoice',
    description: 'Returns a single invoice',
    args: {
      organizationId: t.arg.id({ description: 'Identifier for the Organization' }),
      invoiceId: t.arg.id({ description: 'Identifier for the invoice' }),
    },
    authScopes: (_source, { organizationId }) => ({
      isAdminByOrganization: organizationId.toString(),
    }),
    resolve: (query, _source, { invoiceId }) =>
      prisma.invoice.findUniqueOrThrow({
        ...query,
        where: { id: invoiceId.toString() },
      }),
  }),
)
