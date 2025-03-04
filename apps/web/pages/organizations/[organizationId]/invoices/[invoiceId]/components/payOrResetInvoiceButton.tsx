import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { PayInvoiceButton } from './payInvoiceButton'
import { ResetPayInvoiceButton } from './resetPayInvoiceButton'

const PayOrResetInvoiceButtonFragment = graphql(`
  fragment PayOrResetInvoiceButton on Invoice {
    id
    payDate
    invoiceStatus
    organization {
      id
    }
    ...InvoicePayButton
    ...ResetPayInvoiceButton
  }
`)

interface PayOrResetInvoiceButtonProps {
  invoice: FragmentType<typeof PayOrResetInvoiceButtonFragment>
  onSubmit: (data: InvoiceUpdateInput) => Promise<void>
}

export const PayOrResetInvoiceButton = ({
  invoice: InvoiceFragment,
  onSubmit,
}: PayOrResetInvoiceButtonProps): JSX.Element => {
  const invoice = useFragment(PayOrResetInvoiceButtonFragment, InvoiceFragment)

  return (
    <>
      {invoice.payDate || invoice.invoiceStatus === 'PAID' ? (
        <ResetPayInvoiceButton invoice={invoice} />
      ) : (
        <PayInvoiceButton invoice={invoice} onSubmit={onSubmit} />
      )}
    </>
  )
}
