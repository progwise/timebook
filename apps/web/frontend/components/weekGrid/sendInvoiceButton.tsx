import { useRef } from 'react'
import { useMutation } from 'urql'
import { FragmentType, graphql, useFragment } from '../../generated/gql'

const SendInvoiceButtonFragment = graphql(`
  fragment SendInvoiceButton on Invoice {
    id
  }
`)

const SendInvoiceMutationDocument = graphql(`
  mutation sendInvoice($id: ID!, $sendDate: DateTime!) {
    sendInvoice(id: $id) {
      id
    }
  }
`)
export interface SendInvoiceButtonProps {
  invoice: FragmentType<typeof SendInvoiceButtonFragment>
}

export const SendInvoiceButton = ({ invoice: invoiceFragment }: SendInvoiceButtonProps): JSX.Element => {
  const invoice = useFragment(SendInvoiceButtonFragment, invoiceFragment)
    const [{ fetching }, sendInvoice] = useMutation(SendInvoiceMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleSendInvoice = async () => {
    try {
      await sendInvoice({ id: invoice.id, sendDate: new Date() })
    }
  } catch {}
  dialogReference.current?.close()
}

return(
    <button
    className="btn btn-outline btn-sm btn-block">

    </button>
)
