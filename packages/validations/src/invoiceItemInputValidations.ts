import { z } from 'zod'

export const invoiceItemInputValidations = z.object({
  taskId: z.string(),
  invoiceId: z.string(),
  duration: z
    .number()
    .min(0, 'duration must be positive')
    .max(24 * 60 * 31, 'duration is too long'),
  hourlyRate: z.number().min(0, 'hourly rate must be positive'),
})
