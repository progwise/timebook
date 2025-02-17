import { useRef } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'

const InvoiceItemDeleteMutationDocument = graphql(`
  mutation invoiceItemDelete($invoiceItemId: ID!, $organizationId: ID!) {
    invoiceItemDelete(invoiceItemId: $invoiceItemId, organizationId: $organizationId) {
      id
    }
  }
`)

const InvoiceItemDeleteButtonFragment = graphql(`
  fragment InvoiceItemDeleteButton on InvoiceItem {
    id
    invoice {
      organization {
        id
      }
    }
  }
`)
export interface InvoiceItemDeleteButtonProps {
  invoiceItem: FragmentType<typeof InvoiceItemDeleteButtonFragment>
}

export const InvoiceItemDeleteButton = ({
  invoiceItem: invoiceItemFragment,
}: InvoiceItemDeleteButtonProps): JSX.Element => {
  const invoiceItem = useFragment(InvoiceItemDeleteButtonFragment, invoiceItemFragment)
  const [{ fetching }, invoiceItemDelete] = useMutation(InvoiceItemDeleteMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleDeleteInvoiceItem = async () => {
    try {
      await invoiceItemDelete({ invoiceItemId: invoiceItem.id, organizationId: invoiceItem.invoice.organization.id })
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-outline btm-nav-xs btn-sm"
        aria-label="Delete the invoice item"
        title="Delete the invoice item"
        onClick={() => dialogReference.current?.showModal()}
      >
        <FaRegTrashCan />
      </button>
      <dialog className="modal text-left" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete invoice item</h3>
          <p className="py-4">Are you sure you want to delete this invoice item?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-error btn-sm" onClick={handleDeleteInvoiceItem} disabled={fetching}>
              Delete
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
