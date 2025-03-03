/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceAction } from '../invoiceStatusEnum'
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
      action: t.arg({ type: InvoiceAction, description: 'Action to perform on the invoice', required: false }),
    },
    authScopes: (_source, { organizationId }) => ({ isAdminByOrganization: organizationId?.toString() }),
    resolve: async (
      query,
      _source,
      {
        id: invoiceId,
        data: { customerAddress, customerName, invoiceWorkFrom, invoiceWorkUntil, sendDate, payDate },
        action,
      },
    ) => {
      type UpdateData = {
        customerAddress?: string
        customerName?: string
        invoiceDate?: Date
        invoiceWorkFrom?: Date
        invoiceWorkUntil?: Date
        invoiceStatus?: 'DRAFT' | 'SENT' | 'PAID'
        sendDate?: Date
        payDate?: Date
      }

      const updateData: UpdateData = {
        customerAddress: customerAddress ?? undefined,
        customerName: customerName ?? undefined,
        invoiceWorkFrom: invoiceWorkFrom ?? undefined,
        invoiceWorkUntil: invoiceWorkUntil ?? undefined,
        sendDate: sendDate ?? undefined,
        payDate: payDate ?? undefined,
        invoiceStatus:
          action === InvoiceAction.Withdraw
            ? 'DRAFT'
            : action === InvoiceAction.Send
              ? 'SENT'
              : // eslint-disable-next-line unicorn/no-nested-ternary
                action === InvoiceAction.Pay
                ? 'PAID'
                : 'DRAFT',
      }

      // Get the current local date
      const localNow = new Date()

      switch (action) {
        case InvoiceAction.Withdraw:
          updateData.sendDate = undefined
          updateData.payDate = undefined
          break
        case InvoiceAction.Send:
          if (!sendDate) {
            throw new Error('Send date is required')
          }
          validateSendDate(sendDate, localNow)
          updateData.sendDate = getAdjustedDate(sendDate)
          break
        case InvoiceAction.Pay:
          if (!payDate) {
            throw new Error('Pay date is required')
          }
          updateData.payDate = await validatePayDate(payDate, invoiceId.toString(), localNow)
          break
        case InvoiceAction.ResetPayDate:
          updateData.payDate = undefined
          break
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
