import { z } from 'zod'

export const workHourInputValidations = z.object({
  date: z.date(),
  duration: z
    .number()
    .min(0, 'duration must be positive')
    .max(24 * 60, 'duration is too long'),
  taskId: z.string(),
  comment: z.optional(z.string()),
})
