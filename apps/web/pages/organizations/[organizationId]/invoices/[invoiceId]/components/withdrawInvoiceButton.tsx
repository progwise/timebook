/* eslint-disable unicorn/no-null */
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { InvoiceAction } from '@progwise/timebook-backend/src/graphql/invoice/invoiceStatusEnum'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceUpdateMutationDocument = graphql(`
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!, $action: InvoiceAction) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data, action: $action) {
      id
    }
  }
`)

export const InvoiceWithdrawFragment = graphql(`
  fragment WithdrawInvoiceButton on Invoice {
    id
    customerName
    invoiceStatus
    organization {
      id
    }
  }
`)

interface InvoiceWithdrawButtonProps {
  invoice: FragmentType<typeof InvoiceWithdrawFragment>
}

export const WithdrawInvoiceButton = ({ invoice: InvoiceFragment }: InvoiceWithdrawButtonProps) => {
  const invoice = useFragment(InvoiceWithdrawFragment, InvoiceFragment)
  const [, updateInvoice] = useMutation(InvoiceUpdateMutationDocument)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InvoiceUpdateInput>({
    defaultValues: {
      organizationId: invoice.organization.id,
    },
  })

  const handleWithdraw = async () => {
    await updateInvoice({
      id: invoice.id,
      organizationId: invoice.organization.id,
      data: {
        organizationId: invoice.organization.id,
        sendDate: null,
      },
      action: InvoiceAction.Withdraw,
    })
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm print:hidden"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={isSubmitting || invoice.invoiceStatus === 'PAID'}
      >
        Withdraw
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Withdraw Invoice</h3>
          <p className="py-4"> Are you sure you want to withdraw this invoice billed to {invoice.customerName}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={isSubmitting}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleSubmit(handleWithdraw)} disabled={isSubmitting}>
              Withdraw
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  )
}
