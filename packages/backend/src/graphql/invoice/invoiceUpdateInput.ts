import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceUpdateInput = builder.inputType('InvoiceUpdateInput', {
  validate: { schema: invoiceUpdateInputValidations },
  fields: (t) => ({
    customerAddress: t.string({ required: false }),
    customerName: t.string({ required: false }),
    organizationId: t.id({ required: false }),
    invoiceWorkFrom: t.field({ type: 'Date', required: false }),
    invoiceWorkUntil: t.field({ type: 'Date', required: false }),
    sendDate: t.field({ type: 'Date', required: false }),
    payDate: t.field({ type: 'Date', required: false }),
  }),
})
