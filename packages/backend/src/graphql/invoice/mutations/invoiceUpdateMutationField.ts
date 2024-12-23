import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      id: t.arg.id({ description: 'id of the invoice' }),
      data: t.arg({ type: InvoiceUpdateInput }),
    },
    authScopes: async (_source, { id, data: { organizationId } }) => {
      const invoice = await prisma.invoice.findUniqueOrThrow({
        select: { organizationId: true },
        where: { id: id.toString() },
      })

      const oldOrganizationId = invoice.organizationId
      if (organizationId) {
        const newOrganizationId = organizationId.toString()
        return { isAdminByOrganizations: [oldOrganizationId, newOrganizationId] }
      }

      return { isAdminByOrganization: oldOrganizationId }
    },
    resolve: async (query, _source, { id, data: { customerAddress, customerName, invoiceDate, organizationId } }) => {
      return prisma.invoice.update({
        ...query,
        data: {
          customerAddress,
          customerName: customerName ?? undefined,
          invoiceDate: invoiceDate ?? undefined,
          organizationId: organizationId?.toString(),
        },
        where: { id: id.toString() },
      })
    },
  }),
)
