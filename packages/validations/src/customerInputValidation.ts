import { z } from 'zod'

export const customerInputValidation = z.object({
  title: z.string().trim().min(2, 'title is too short').max(50, 'title is too long'),
})
