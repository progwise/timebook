import { isValid, parseISO } from 'date-fns'
import { z } from 'zod'

import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { getDate } from '../../../../frontend/components/dateStringValidation'
import { InvoiceUpdateInput } from '../../../../frontend/generated/gql/graphql'

const invoiceUpdateWorkDateSchema = z
  .string()
  .min('____-__-__'.length, 'Enter a date')
  .refine((value) => value === '' || value !== '____-__-__', 'Enter a date')
  .refine((value) => value === '' || isValid(parseISO(value)), 'Invalid date')

export const invoiceUpdateInputSchema: z.ZodSchema<InvoiceUpdateInput> = invoiceUpdateInputValidations
  .extend({
    invoiceWorkFrom: invoiceUpdateWorkDateSchema,
    invoiceWorkUntil: invoiceUpdateWorkDateSchema,
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
