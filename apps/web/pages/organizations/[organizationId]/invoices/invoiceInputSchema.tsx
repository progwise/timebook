import { isValid, parseISO } from 'date-fns'
import { z } from 'zod'

import { invoiceInputValidations } from '@progwise/timebook-validations'

import { getDate } from '../../../../frontend/components/dateStringValidation'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'

const invoiceWorkDateSchema = z
  .string()
  .refine((value) => value !== '____-__-__', 'enter a date')
  .refine((value) => !value || isValid(parseISO(value)), 'invalid date')

export const invoiceInputSchema: z.ZodSchema<InvoiceInput> = invoiceInputValidations
  .extend({
    invoiceWorkFrom: invoiceWorkDateSchema,
    invoiceWorkUntil: invoiceWorkDateSchema,
    invoiceDate: z.string(),
  })
  .superRefine((arguments_, context) => {
    const isStartBeforeEnd = (getDate(arguments_.invoiceWorkFrom) || 0) <= (getDate(arguments_.invoiceWorkUntil) || 1)

    if (!isStartBeforeEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['invoiceWorkUntil'],
        message: 'The end date must be after start date',
      })
    }
  })
