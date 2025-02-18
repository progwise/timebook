import { builder } from '../builder'

export const InvoiceSendInput = builder.inputType('InvoiceSendInput', {
  fields: (t) => ({
    invoiceId: t.id(),
    organizationId: t.id(),
    sendDate: t.field({ type: 'Date', required: false }),
  }),
})
