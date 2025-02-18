import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      id: t.arg.id({ description: 'ID of the invoice' }),
      data: t.arg({ type: InvoiceUpdateInput }),
    },
    authScopes: (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId?.toString() }),
    resolve: async (
      query,
      _source,
      { id, data: { customerAddress, customerName, invoiceWorkFrom, invoiceWorkUntil } },
    ) => {
      const invoice = await prisma.invoice.findUniqueOrThrow({
        where: { id: id.toString() },
      })

      if (invoiceWorkFrom && invoiceWorkUntil && invoiceWorkFrom >= invoiceWorkUntil) {
        throw new Error('The end date must be after the start date')
      }

      const updatedInvoice = await prisma.invoice.update({
        ...query,
        data: {
          customerAddress: customerAddress ?? undefined,
          customerName: customerName ?? undefined,
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
            date: {
              ...(invoiceWorkFrom && { gte: invoiceWorkFrom }),
              ...(invoiceWorkUntil && { lte: invoiceWorkUntil }),
            },

            task: { project: { organization: { id: invoice.organizationId } } },

            taskId: {
              notIn: [...existingTaskIds],
            },
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
