import { builder } from '../builder'
import { InvoiceStatus, InvoiceStatusEnum } from './invoiceStatusEnum'

export const InvoiceSendInput = builder.inputType('InvoiceSendInput', {
  fields: (t) => ({
    id: t.id(),
    organizationId: t.id(),
    invoiceStatus: t.field({ type: InvoiceStatusEnum, defaultValue: InvoiceStatus.DRAFT }),
    sendDate: t.field({ type: 'DateTime' }),
  }),
})
