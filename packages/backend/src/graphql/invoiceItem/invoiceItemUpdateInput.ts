import { invoiceItemUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceItemUpdateInput = builder.inputType('InvoiceItemUpdateInput', {
  validate: { schema: invoiceItemUpdateInputValidations },
  fields: (t) => ({
    organizationId: t.id({ required: false }),
    duration: t.int({ description: 'Invoice item duration in minutes', required: false }),
    hourlyRate: t.int({ description: 'Invoice item hourly rate in euro', required: false }),
  }),
})
