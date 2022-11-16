import { z } from 'zod'

export const teamInputValidations = z.object({
  title: z.string().trim().min(1, 'title is missing').max(50, 'title is too long'),
  slug: z
    .string()
    .trim()
    .min(1, 'slug is missing')
    .max(50, 'slug is too long')
    .regex(/^[\w\-]+$/, 'You are only allowed to use digits, characters, -, _'),
})
