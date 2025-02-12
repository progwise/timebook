import { isValid, parseISO } from 'date-fns'
import { z } from 'zod'

import { invoiceInputValidations } from '@progwise/timebook-validations'

import { getDate } from '../../../../frontend/components/dateStringValidation'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'

const invoiceWorkDateSchema = z
  .string()
  .min('____-__-__'.length, 'Enter a date')
  .refine((value) => value !== '____-__-__', 'Enter a date')
  .refine((value) => !value || isValid(parseISO(value)), 'Invalid date')

export const invoiceInputSchema: z.ZodSchema<InvoiceInput> = invoiceInputValidations
  .extend({
    invoiceWorkFrom: invoiceWorkDateSchema,
    invoiceWorkUntil: invoiceWorkDateSchema,
  })
  .superRefine((data, context) => {
    const startDate = getDate(data.invoiceWorkFrom)
    const endDate = getDate(data.invoiceWorkUntil)

    if (startDate && endDate && startDate >= endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['invoiceWorkUntil'],
        message: 'End date must be after start date',
      })
    }
  })
