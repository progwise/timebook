/* eslint-disable unicorn/no-null */
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { graphql } from '../../../../../../frontend/generated/gql'
import { InvoiceSendInput } from '../../../../../../frontend/generated/gql/graphql'

const WithdrawInvoiceMutationDocument = graphql(`
  mutation withdrawInvoice($data: InvoiceSendInput!) {
    withdrawInvoice(data: $data) {
      id
    }
  }
`)

interface WithdrawInvoiceButtonProps {
  invoiceId: string
  organizationId: string
}

export const WithdrawInvoiceButton = ({ invoiceId, organizationId }: WithdrawInvoiceButtonProps) => {
  const [, withdrawInvoice] = useMutation(WithdrawInvoiceMutationDocument)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InvoiceSendInput>({
    defaultValues: {
      invoiceId,
      organizationId,
    },
  })

  const handleWithdraw = async () => {
    await withdrawInvoice({
      data: {
        invoiceId,
        organizationId,
        sendDate: null,
      },
    })
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={isSubmitting}
      >
        Withdraw
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Withdraw Invoice</h3>
          <p className="py-4"> Are you sure you want to withdraw this invoice?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={isSubmitting}>
                Cancel
              </button>
            </form>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleSubmit(handleWithdraw)}
              disabled={isSubmitting}
              form="send-invoice-form"
            >
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
