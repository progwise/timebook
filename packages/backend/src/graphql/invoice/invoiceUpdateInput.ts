import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceUpdateInput = builder.inputType('InvoiceUpdateInput', {
  validate: { schema: invoiceUpdateInputValidations },
  fields: (t) => ({
    customerAddress: t.string({ required: false }),
    customerName: t.string({ required: false }),
    invoiceDate: t.field({ type: 'Date', required: false }),
    organizationId: t.id({ required: false }),
  }),
})
