import { useMutation } from 'urql'

import { InvoiceAction } from '@progwise/timebook-backend/src/graphql/invoice/invoiceStatusEnum'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { PayOrResetInvoiceButton } from './payOrResetInvoiceButton'
import { SendOrWithdrawInvoiceButton } from './sendOrWithdrawInvoiceButton'

const InvoiceActionButtonsFragment = graphql(`
  fragment InvoiceActionButtons on Invoice {
    id
    sendDate
    payDate
    organization {
      id
    }
    ...SendOrWithdrawInvoice
    ...PayOrResetInvoiceButton
  }
`)

const InvoiceUpdateMutationDocument = graphql(`
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!, $action: InvoiceAction) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data, action: $action) {
      id
    }
  }
`)

interface InvoiceActionButtonsProps {
  invoice: FragmentType<typeof InvoiceActionButtonsFragment>
}

export const InvoiceActionButtons = ({ invoice: invoiceFragment }: InvoiceActionButtonsProps) => {
  const invoice = useFragment(InvoiceActionButtonsFragment, invoiceFragment)
  const [, updateInvoice] = useMutation(InvoiceUpdateMutationDocument)

  const handleSendOrWithdrawInvoice = async (data: InvoiceUpdateInput) => {
    const action = invoice.sendDate ? InvoiceAction.Withdraw : InvoiceAction.Send
    try {
      await updateInvoice({
        id: invoice.id,
        organizationId: invoice.organization.id,
        data: {
          sendDate: data.sendDate,
        },
        action,
      })
    } catch {}
  }

  const handlePayOrResetInvoice = async (data: InvoiceUpdateInput) => {
    const action = invoice.payDate ? InvoiceAction.ResetPayDate : InvoiceAction.Pay
    try {
      await updateInvoice({
        id: invoice.id,
        organizationId: invoice.organization.id,
        data: {
          payDate: data.payDate,
        },
        action,
      })
    } catch {}
  }

  return (
    <div className="flex gap-4">
      <SendOrWithdrawInvoiceButton invoice={invoice} onSubmit={handleSendOrWithdrawInvoice} />
      <PayOrResetInvoiceButton invoice={invoice} onSubmit={handlePayOrResetInvoice} />
    </div>
  )
}
