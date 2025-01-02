import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceItemInput = builder.inputType('InvoiceItemInput', {
  validate: { schema: invoiceItemInputValidations },
  fields: (t) => ({
    taskId: t.id(),
    invoiceId: t.id(),
    duration: t.int({ description: 'Invoice item duration in minutes' }),
    hourlyRate: t.int({ description: 'Invoice item hourly rate in euro' }),
  }),
})
