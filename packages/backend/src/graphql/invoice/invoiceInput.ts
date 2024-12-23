import { invoiceInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceInput = builder.inputType('InvoiceInput', {
  validate: { schema: invoiceInputValidations },
  fields: (t) => ({
    customerAddress: t.string({ required: false }),
    customerName: t.string(),
    invoiceDate: t.field({ type: 'Date' }),
    organizationId: t.id(),
  }),
})
