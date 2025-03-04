/* eslint-disable unicorn/no-null */
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceUpdateMutationDocument = graphql(`
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data) {
      id
    }
  }
`)

export const InvoiceResetPayFragment = graphql(`
  fragment ResetPayInvoiceButton on Invoice {
    id
    payDate
    invoiceStatus
    customerName
    organization {
      id
    }
  }
`)

interface ResetPayInvoiceButtonProps {
  invoice: FragmentType<typeof InvoiceResetPayFragment>
}

export const ResetPayInvoiceButton = ({ invoice: InvoiceFragment }: ResetPayInvoiceButtonProps): JSX.Element => {
  const invoice = useFragment(InvoiceResetPayFragment, InvoiceFragment)
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

  const handleResetPayDate = async () => {
    await updateInvoice({
      id: invoice.id,
      organizationId: invoice.organization.id,
      data: {
        organizationId: invoice.organization.id,
        payDate: null,
      },
    })
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm print:hidden"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={isSubmitting}
      >
        {invoice.invoiceStatus === 'PAID' ? 'Reset Pay Date' : 'Pay'}
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Reset Pay Date</h3>
          <p className="py-4">
            Are you sure you want to reset the pay date for the invoice billed to {invoice.customerName}?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={isSubmitting}>
                Cancel
              </button>
            </form>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleSubmit(handleResetPayDate)}
              disabled={isSubmitting}
            >
              Reset
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
