import { invoiceUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const InvoiceUpdateInput = builder.inputType('InvoiceUpdateInput', {
  validate: { schema: invoiceUpdateInputValidations },
  fields: (t) => ({
    customerAddress: t.field({ type: 'String', required: false }),
    customerName: t.field({ type: 'String', required: false }),
    invoiceDate: t.field({ type: 'Date', required: false }),
    organizationId: t.field({ type: 'ID', required: false }),
    invoiceWorkFrom: t.field({ type: 'Date', required: false }),
    invoiceWorkUntil: t.field({ type: 'Date', required: false }),
    sendDate: t.field({ type: 'DateTime', required: false }),
    payDate: t.field({ type: 'DateTime', required: false }),
  }),
})
