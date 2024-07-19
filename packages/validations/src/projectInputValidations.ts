import { z } from 'zod'

export const projectInputValidations = z.object({
  title: z.string().trim().min(1, 'title is required').max(50, 'title is too long'),
  start: z.date().nullish(),
  end: z.date().nullish(),
  organizationId: z.string().nullish(),
})
