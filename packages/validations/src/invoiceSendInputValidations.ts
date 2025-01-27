import { z } from 'zod'

export const invoiceSendInputValidations = z.object({
  id: z.string(),
  organizationId: z.string(),
  invoiceStatus: z.string().optional(),
  sendDate: z.string().optional(),
})
