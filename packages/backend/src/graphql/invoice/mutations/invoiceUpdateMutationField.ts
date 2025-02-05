import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      invoiceId: t.arg.id({ description: 'ID of the invoice' }),
      data: t.arg({ type: InvoiceUpdateInput }),
    },
    authScopes: async (_source, { invoiceId, data: { organizationId } }) => {
      const invoice = await prisma.invoice.findUniqueOrThrow({
        select: { organizationId: true },
        where: { id: invoiceId.toString() },
      })

      const oldOrganizationId = invoice.organizationId
      if (organizationId) {
        const newOrganizationId = organizationId.toString()
        return { isAdminByOrganizations: [oldOrganizationId, newOrganizationId] }
      }

      return { isAdminByOrganization: oldOrganizationId }
    },
    resolve: async (
      query,
      _source,
      {
        invoiceId,
        data: { customerAddress, customerName, invoiceDate, organizationId, invoiceWorkFrom, invoiceWorkUntil },
      },
    ) => {
      return prisma.invoice.update({
        ...query,
        data: {
          customerAddress: customerAddress ?? undefined,
          customerName: customerName ?? undefined,
          invoiceDate: invoiceDate ?? undefined,
          organizationId: organizationId?.toString(),
          invoiceWorkFrom: invoiceWorkFrom ?? undefined,
          invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        },
        where: { id: invoiceId.toString() },
      })
    },
  }),
)
