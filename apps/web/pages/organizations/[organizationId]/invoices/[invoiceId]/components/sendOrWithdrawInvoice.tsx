import { FragmentType } from '../../../../../../frontend/generated/gql'
import { graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceSendInput } from '../../../../../../frontend/generated/gql/graphql'
import { SendInvoiceButton } from './sendInvoiceButton'
import { WithdrawInvoiceButton } from './withdrawInvoiceButton'

const InvoiceSendOrWithdrawFragment = graphql(`
  fragment SendOrWithdrawInvoice on Invoice {
    id
    sendDate
    invoiceStatus
    ...SendInvoiceButton
    ...WithdrawInvoiceButton
  }
`)

interface InvoiceSendOrWithdrawProps {
  invoice: FragmentType<typeof InvoiceSendOrWithdrawFragment>
  onSubmit: (data: InvoiceSendInput) => Promise<void>
}

export const SendOrWithdrawInvoice = ({ invoice: InvoiceFragment, onSubmit }: InvoiceSendOrWithdrawProps) => {
  const invoice = useFragment(InvoiceSendOrWithdrawFragment, InvoiceFragment)

  if (invoice.sendDate && invoice.invoiceStatus === 'SENT') {
    return <WithdrawInvoiceButton invoice={invoice} />
  }

  return <SendInvoiceButton invoice={invoice} onSubmit={onSubmit} />
}
