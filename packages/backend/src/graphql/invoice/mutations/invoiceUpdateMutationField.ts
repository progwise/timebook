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
    resolve: async (
      query,
      _source,
      { id, data: { customerAddress, customerName, invoiceDate, organizationId, invoiceWorkFrom, invoiceWorkUntil } },
    ) => {
      const updatedInvoice = await prisma.invoice.update({
        ...query,
        data: {
          customerAddress: customerAddress ?? undefined,
          customerName: customerName ?? undefined,
          invoiceDate: invoiceDate ?? undefined,
          organizationId: organizationId?.toString(),
          invoiceWorkFrom: invoiceWorkFrom ?? undefined,
          invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        },
        where: { id: id.toString() },
      })

      if (invoiceWorkFrom || invoiceWorkUntil) {
        const existingInvoiceItems = await prisma.invoiceItem.findMany({
          where: { invoiceId: updatedInvoice.id },
          select: { taskId: true },
        })

        const existingTaskIds = new Set(existingInvoiceItems.map((item) => item.taskId))

        const workHours = await prisma.workHour.groupBy({
          by: ['taskId'],
          where: {
            AND: [
              {
                date: {
                  ...(invoiceWorkFrom && { gte: invoiceWorkFrom }),
                  ...(invoiceWorkUntil && { lte: invoiceWorkUntil }),
                },
              },
              {
                task: {
                  project: {
                    organizationId: updatedInvoice.organizationId,
                  },
                },
              },
              {
                taskId: {
                  notIn: [...existingTaskIds],
                },
              },
            ],
          },
          _sum: {
            duration: true,
          },
        })

        const invoiceItems = workHours.map((workHour) => ({
          invoiceId: updatedInvoice.id,
          taskId: workHour.taskId,
          duration: workHour._sum.duration ?? 0,
          hourlyRate: 0,
        }))

        if (invoiceItems.length > 0) {
          await prisma.invoiceItem.createMany({
            data: invoiceItems,
          })
        }
      }

      return updatedInvoice
    },
  }),
)
