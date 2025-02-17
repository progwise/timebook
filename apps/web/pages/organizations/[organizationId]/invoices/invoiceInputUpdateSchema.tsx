import { isAfter, isValid, parseISO } from 'date-fns'
import { z } from 'zod'

import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { getDate } from '../../../../frontend/components/dateStringValidation'
import { InvoiceUpdateInput } from '../../../../frontend/generated/gql/graphql'

const invoiceUpdateDateSchema = z
  .string()
  .min(10, 'Enter a date')
  .refine((value) => value === '' || value !== '____-__-__', 'Enter a date')
  .refine((value) => !value || isValid(parseISO(value)), 'Invalid date')

export const invoiceUpdateInputSchema: z.ZodSchema<InvoiceUpdateInput> = invoiceUpdateInputValidations
  .extend({
    invoiceWorkFrom: invoiceUpdateDateSchema.optional(),
    invoiceWorkUntil: invoiceUpdateDateSchema.optional(),
    sendDate: invoiceUpdateDateSchema
      .refine(
        (value) => !value || !isAfter(parseISO(value), new Date()),
        'Send date cannot be a future date. Please enter a valid date.',
      )
      .optional(),
    payDate: invoiceUpdateDateSchema
      .refine(
        (value) => !value || !isAfter(parseISO(value), new Date()),
        'Pay date cannot be a future date. Please enter a valid date.',
      )
      .optional(),
  })
  .superRefine((data, context) => {
    const startDate = getDate(data.invoiceWorkFrom)
    const endDate = getDate(data.invoiceWorkUntil)
    const sendDate = getDate(data.sendDate)
    const payDate = getDate(data.payDate)

    if (startDate && endDate && startDate >= endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['invoiceWorkUntil'],
        message: 'End date must be after start date',
      })
    }

    if (sendDate && payDate && sendDate > payDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payDate'],
        message: 'Pay date must not be before send date',
      })
    }
  })
