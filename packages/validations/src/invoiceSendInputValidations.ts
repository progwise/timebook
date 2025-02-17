import { z } from 'zod'

export const invoiceSendInputValidations = z.object({
  invoiceId: z.string(),
  organizationId: z.string(),
  sendDate: z.date().nullish(),
})
