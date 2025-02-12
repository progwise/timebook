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

export enum InvoiceAction {
  Send = 'Send',
  Pay = 'Pay',
  Withdraw = 'Withdraw',
  ResetPayDate = 'ResetPayDate',
}

export const InvoiceActionEnum = builder.enumType(InvoiceAction, {
  name: 'InvoiceAction',
  description: 'Actions that can be performed on an invoice',
})
