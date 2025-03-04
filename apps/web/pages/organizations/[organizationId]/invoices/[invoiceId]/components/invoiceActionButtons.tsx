import { useMutation } from 'urql'

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
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data) {
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
    try {
      await updateInvoice({
        id: invoice.id,
        organizationId: invoice.organization.id,
        data: {
          sendDate: invoice.sendDate ?? data.sendDate,
        },
      })
    } catch {}
  }

  const handlePayOrResetInvoice = async (data: InvoiceUpdateInput) => {
    try {
      await updateInvoice({
        id: invoice.id,
        organizationId: invoice.organization.id,
        data: {
          payDate: invoice.payDate ?? data.payDate,
        },
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
