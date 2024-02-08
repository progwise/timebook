import { z } from 'zod'

export const accessTokenInputValidations = z.object({
  name: z.string().trim().min(1, 'title must be at least 1 character').max(50, 'title is too long'),
})
