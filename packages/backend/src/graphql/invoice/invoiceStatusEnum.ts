import { builder } from '../builder'

export enum InvoiceStatus {
  DRAFT,
  SENT,
  PAID,
}

export const InvoiceStatusEnum = builder.enumType(InvoiceStatus, {
  name: 'InvoiceStatus',
  description: 'Status of the invoice',
})
