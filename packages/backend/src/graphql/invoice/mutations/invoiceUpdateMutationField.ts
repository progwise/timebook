import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceStatus, InvoiceStatusEnum } from '../invoiceStatusEnum'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      id: t.arg.id({ description: 'id of the invoice' }),
      data: t.arg({ type: InvoiceUpdateInput }),
      invoiceStatus: t.arg({ type: InvoiceStatusEnum, defaultValue: InvoiceStatus.DRAFT }),
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
    resolve: async (
      query,
      _source,
      { id, data: { customerAddress, customerName, invoiceDate, organizationId, invoiceStatus } },
    ) => {
      const existingInvoice = await prisma.invoice.findUniqueOrThrow({
        select: { invoiceStatus: true, sendDate: true, payDate: true },
        where: { id: id.toString() },
      })
      if (existingInvoice.payDate && existingInvoice.sendDate && existingInvoice.payDate < existingInvoice.sendDate) {
        throw new Error('Pay date cannot be before send date')
      }
      switch (invoiceStatus) {
        case InvoiceStatus.SENT:
          return prisma.invoice.update({
            ...query,
            data: {
              customerAddress,
              customerName: customerName ?? undefined,
              invoiceDate: invoiceDate ?? undefined,
              organizationId: organizationId?.toString(),
              invoiceStatus: 'SENT',
            },
            where: { id: id.toString() },
          })
        case InvoiceStatus.PAID:
          return prisma.invoice.update({
            ...query,
            data: {
              customerAddress,
              customerName: customerName ?? undefined,
              invoiceDate: invoiceDate ?? undefined,
              organizationId: organizationId?.toString(),
              invoiceStatus: 'PAID',
            },
            where: { id: id.toString() },
          })
        default:
          return prisma.invoice.update({
            ...query,
            data: {
              customerAddress,
              customerName: customerName ?? undefined,
              invoiceDate: invoiceDate ?? undefined,
              organizationId: organizationId?.toString(),
              invoiceStatus: 'DRAFT',
            },
            where: { id: id.toString() },
          })
      }
    },
  }),
)
