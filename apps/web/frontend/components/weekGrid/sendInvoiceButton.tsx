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
      await sendInvoice({ id: invoice.id, sendDate: new Date().toDateString() })
    } catch {}
    {
      dialogReference.current?.close()
    }
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={fetching}
      >
        SEND
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Send Invoice</h3>
          <p className="py-4"> Do you want to send this invoice?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleSendInvoice} disabled={fetching}>
              Send
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
