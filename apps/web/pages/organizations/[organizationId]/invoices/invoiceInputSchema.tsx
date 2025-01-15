import { isValid, parseISO } from 'date-fns'
import { z } from 'zod'

import { invoiceInputValidations } from '@progwise/timebook-validations'

import { getDate } from '../../../../frontend/components/dateStringValidation'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'

export const invoiceInputSchema: z.ZodSchema<InvoiceInput> = invoiceInputValidations
  .extend({
    invoiceWorkFrom: z
      .string()
      .refine((value) => value !== '____-__-__', 'enter a date')
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
    invoiceWorkUntil: z
      .string()
      .refine((value) => value !== '____-__-__', 'enter a date')
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
    invoiceDate: z.string(),
  })
  .superRefine((arguments_, context) => {
    if (!arguments_.invoiceWorkUntil) {
      return
    }
    const isStartBeforeEnd = (getDate(arguments_.invoiceWorkFrom) || 0) <= (getDate(arguments_.invoiceWorkUntil) || 1)

    if (!isStartBeforeEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end'],
        message: 'The end date must be after start date',
      })
    }
  })
