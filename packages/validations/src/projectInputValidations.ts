import { z } from 'zod'

export const projectInputValidations = z.object({
  title: z.string().trim().min(1, 'title is required').max(20, 'title is too long'),
  customerId: z.string().nullish(),
  start: z.date().nullish(),
  end: z.date().nullish(),
})
