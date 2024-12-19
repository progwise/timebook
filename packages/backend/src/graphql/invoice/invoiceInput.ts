import { builder } from '../builder'

export const InvoiceInput = builder.inputType('InvoiceInput', {
  fields: (t) => ({
    customerAddress: t.string({ required: false }),
    customerName: t.string(),
    invoiceDate: t.field({ type: 'Date' }),
    organizationId: t.id(),
  }),
})
