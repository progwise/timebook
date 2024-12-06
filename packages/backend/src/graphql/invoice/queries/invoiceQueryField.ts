import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('invoice', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Returns a single invoice',
    args: {
      invoiceId: t.arg.id({ description: 'Identifier for the invoice' }),
      //   organizationId: t.arg.id({ description: 'Identifier of the organization of the invoice' }),
    },
    authScopes: async (_source, { invoiceId }) => {
      const invoice = await prisma.invoice.findUniqueOrThrow({
        select: { organizationId: true },
        where: { id: invoiceId.toString() },
      })

      return { isAdminByOrganization: invoice.organizationId.toString() }
    },
    resolve: (query, _source, { invoiceId }) =>
      prisma.invoice.findUniqueOrThrow({
        ...query,
        where: { id: invoiceId.toString() },
      }),
  }),
)
