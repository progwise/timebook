import { isValid, parseISO } from 'date-fns'
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
    sendDate: invoiceUpdateDateSchema.optional(),
    payDate: invoiceUpdateDateSchema.optional(),
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

    if (sendDate && sendDate > new Date()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sendDate'],
        message: 'Send date cannot be a future date. Please enter a valid date.',
      })
    }

    if (payDate && payDate > new Date()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payDate'],
        message: 'Pay date cannot be a future date. Please enter a valid date.',
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
