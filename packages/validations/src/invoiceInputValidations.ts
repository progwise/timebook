import { z } from 'zod'

export const invoiceInputValidations = z.object({
  customerAddress: z.string().trim().max(100, 'address is too long').nullish(),
  customerName: z.string().trim().min(1, 'Name is required').max(50, 'name is too long'),
  organizationId: z.string(),
  invoiceWorkFrom: z.date(),
  invoiceWorkUntil: z.date(),
})
