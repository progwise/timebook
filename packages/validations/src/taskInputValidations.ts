import { z } from 'zod'

export const taskInputValidations = z.object({
  title: z.string().trim().min(4, 'title must be at least 4 characters').max(50, 'title is too long'),
  projectId: z.string(),
  hourlyRate: z.coerce
    .number()
    .transform((val) => (val === 0 ? null : val))
    .optional(),
})
