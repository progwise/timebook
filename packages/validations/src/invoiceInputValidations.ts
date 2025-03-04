import { z } from 'zod'

export const invoiceInputValidations = z.object({
  customerAddress: z.string().trim().max(100, 'Address is too long').nullish(),
  customerName: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
  organizationId: z.string(),
  invoiceWorkFrom: z.date(),
  invoiceWorkUntil: z.date(),
  sendDate: z.date().nullish(),
  payDate: z.date().nullish(),
})
