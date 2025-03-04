/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceUpdateInput } from '../invoiceUpdateInput'

const getAdjustedDate = (date: Date): Date => {
  const adjustedDate = new Date(date)
  adjustedDate.setUTCHours(0, 0, 0, 0)
  return adjustedDate
}

const validateSendDate = (sendDate: Date, localNow: Date): void => {
  const adjustedSendDate = getAdjustedDate(sendDate)
  const localNowUTC = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)
  if (adjustedSendDate.getTime() > localNowUTC.getTime()) {
    throw new Error('Invoice send date must not be in the future')
  }
}

const validatePayDate = async (payDate: Date, invoiceId: string, localNow: Date): Promise<Date> => {
  const adjustedPayDate = getAdjustedDate(payDate)
  const localNowUTC = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60_000)
  if (adjustedPayDate.getTime() >= localNowUTC.getTime()) {
    throw new Error('Invoice pay date must not be in the future')
  }

  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { sendDate: true },
  })

  if (existingInvoice?.sendDate) {
    const existingSendDate = getAdjustedDate(new Date(existingInvoice.sendDate))
    if (adjustedPayDate.getTime() < existingSendDate.getTime()) {
      throw new Error('Invoice pay date must not be before send date')
    }
  }

  return adjustedPayDate
}

const updateInvoiceItems = async (
  updatedInvoice: { id: string; organizationId: string },
  invoiceWorkFrom?: Date,
  invoiceWorkUntil?: Date,
) => {
  if (invoiceWorkFrom || invoiceWorkUntil) {
    const existingInvoiceItems = await prisma.invoiceItem.findMany({
      where: { invoiceId: updatedInvoice.id },
      select: { taskId: true },
    })

    const existingTaskIds = new Set(existingInvoiceItems.map((invoiceItem) => invoiceItem.taskId))

    const workHours = await prisma.workHour.groupBy({
      by: ['taskId'],
      where: {
        date: {
          ...(invoiceWorkFrom && { gte: invoiceWorkFrom }),
          ...(invoiceWorkUntil && { lte: invoiceWorkUntil }),
        },
        task: { project: { organization: { id: updatedInvoice.organizationId } } },
        taskId: { notIn: [...existingTaskIds] },
      },
      _sum: { duration: true },
    })

    const invoiceItems = workHours.map((workHour) => ({
      invoiceId: updatedInvoice.id,
      taskId: workHour.taskId,
      duration: workHour._sum.duration ?? 0,
      hourlyRate: 0,
    }))

    if (invoiceItems.length > 0) {
      await prisma.invoiceItem.createMany({ data: invoiceItems })
    }
  }
}

builder.mutationField('invoiceUpdate', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Update an invoice',
    args: {
      id: t.arg.id({ description: 'ID of the invoice' }),
      organizationId: t.arg.id({ description: 'ID of the organization' }),
      data: t.arg({ type: InvoiceUpdateInput }),
    },
    authScopes: (_source, { organizationId }) => ({ isAdminByOrganization: organizationId?.toString() }),
    resolve: async (
      query,
      _source,
      { id: invoiceId, data: { customerAddress, customerName, invoiceWorkFrom, invoiceWorkUntil, sendDate, payDate } },
    ) => {
      const updateData = {
        customerAddress: customerAddress,
        customerName: customerName ?? undefined,
        invoiceWorkFrom: invoiceWorkFrom ?? undefined,
        invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        sendDate: sendDate,
        payDate: payDate,
        invoiceStatus: 'DRAFT' as 'DRAFT' | 'SENT' | 'PAID',
      }

      // Get the current local date
      const localNow = new Date()

      if (sendDate === null) {
        updateData.sendDate = null
        updateData.payDate = null
      } else if (sendDate) {
        validateSendDate(sendDate, localNow)
        updateData.sendDate = getAdjustedDate(sendDate)
        updateData.invoiceStatus = 'SENT'
      }

      if (payDate === null) {
        updateData.payDate = null
      } else if (payDate) {
        updateData.payDate = await validatePayDate(payDate, invoiceId.toString(), localNow)
        updateData.invoiceStatus = 'PAID'
      }

      const updatedInvoice = await prisma.invoice.update({
        ...query,
        data: updateData,
        where: { id: invoiceId.toString() },
      })

      if (invoiceWorkFrom && invoiceWorkUntil && invoiceWorkFrom >= invoiceWorkUntil) {
        throw new Error('Invoice end date must be after the start date')
      }

      await updateInvoiceItems(updatedInvoice, invoiceWorkFrom ?? undefined, invoiceWorkUntil ?? undefined)

      return updatedInvoice
    },
  }),
)
