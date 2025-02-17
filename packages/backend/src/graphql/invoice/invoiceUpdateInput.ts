import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceUpdateInput = builder.inputType('InvoiceUpdateInput', {
  validate: { schema: invoiceUpdateInputValidations },
  fields: (t) => ({
    invoiceDate: t.field({ type: 'Date', required: false }),
    customerAddress: t.field({ type: 'String', required: false }),
    customerName: t.field({ type: 'String', required: false }),
    organizationId: t.field({ type: 'ID', required: false }),
    invoiceWorkFrom: t.field({ type: 'Date', required: false }),
    invoiceWorkUntil: t.field({ type: 'Date', required: false }),
    sendDate: t.field({ type: 'Date', required: false }),
    payDate: t.field({ type: 'Date', required: false }),
  }),
})
