import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceInput } from '../invoiceInput'

builder.mutationField('invoiceCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Invoice',
    description: 'Create a new invoice',
    args: {
      data: t.arg({ type: InvoiceInput }),
    },
    authScopes: (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (
      query,
      _source,
      { data: { customerAddress, customerName, organizationId, invoiceWorkFrom, invoiceWorkUntil } },
      context,
    ) => {
      return prisma.invoice.create({
        ...query,
        data: {
          customerAddress,
          customerName,
          organizationId: organizationId.toString(),
          createdByUserId: context.session.user.id,
          invoiceWorkFrom,
          invoiceWorkUntil,
        },
      })
    },
  }),
)
