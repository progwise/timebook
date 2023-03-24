import { z } from 'zod'

export const taskInputValidations = z.object({
  title: z.string().trim().min(1, 'title must be at least 1 character').max(50, 'title is too long'),
  projectId: z.string(),
  hourlyRate: z.coerce
    .number()
    // eslint-disable-next-line unicorn/no-null
    .transform((value) => (value === 0 ? null : value))
    .optional(),
})
