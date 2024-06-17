import { z } from 'zod'

export const organizationInputValidations = z.object({
  title: z.string().trim().min(1, 'title is required').max(50, 'title is too long'),
  address: z.string().trim().optional(),
})
