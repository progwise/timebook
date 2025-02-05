import { FragmentType } from '../../../../../../frontend/generated/gql'
import { graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceSendInput } from '../../../../../../frontend/generated/gql/graphql'
import { SendInvoiceButton } from './sendInvoiceButton'
import { WithdrawInvoiceButton } from './withdrawInvoiceButton'

const SendOrWithdrawInvoiceFragment = graphql(`
  fragment SendOrWithdrawInvoice on Invoice {
    id
    sendDate
    invoiceStatus
    organization {
      id
    }
    ...SendInvoiceButton
  }
`)

interface SendOrWithdrawInvoiceProps {
  invoice: FragmentType<typeof SendOrWithdrawInvoiceFragment>
  onSubmit: (data: InvoiceSendInput) => Promise<void>
}

export const SendOrWithdrawInvoice = ({ invoice: InvoiceFragment, onSubmit }: SendOrWithdrawInvoiceProps) => {
  const invoice = useFragment(SendOrWithdrawInvoiceFragment, InvoiceFragment)

  if (invoice.sendDate && invoice.invoiceStatus === 'SENT') {
    return <WithdrawInvoiceButton invoiceId={invoice.id} organizationId={invoice.organization.id} />
  }

  return <SendInvoiceButton invoice={invoice} onSubmit={onSubmit} />
}
