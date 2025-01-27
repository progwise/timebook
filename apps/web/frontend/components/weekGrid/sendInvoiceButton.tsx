import { format } from 'date-fns'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

// import { useMutation } from 'urql'
// import { InvoiceFragment } from '../../../pages/organizations/[organizationId]/components/invoiceTable'
import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { InvoiceSendInput } from '../../generated/gql/graphql'
import { CalendarSelector } from '../calendarSelector'
import { dateStringValidation, getDate } from '../dateStringValidation'

const SendInvoiceButtonFragment = graphql(`
  fragment SendInvoiceButton on Invoice {
    id
    organization {
      id
    }
  }
`)

// const SendInvoiceMutationDocument = graphql(`
//   mutation sendInvoice($data: InvoiceSendInput!) {
//     sendInvoice(data: $data) {
//       id
//     }
//   }
// `)
export interface SendInvoiceButtonProps {
  invoice: FragmentType<typeof SendInvoiceButtonFragment>
  onSubmit: (data: InvoiceSendInput) => Promise<void>
}

export const SendInvoiceButton = ({ invoice: InvoiceFragment, onSubmit }: SendInvoiceButtonProps): JSX.Element => {
  const invoice = useFragment(SendInvoiceButtonFragment, InvoiceFragment)
  // const [{ fetching }, sendInvoice] = useMutation(SendInvoiceMutationDocument)
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InvoiceSendInput>({ defaultValues: { sendDate: format(new Date(), 'yyyy-MM-dd') } })
  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleSendInvoice = async (data: InvoiceSendInput) => {
    return onSubmit({
      ...data,
      id: invoice.id,
      organizationId: invoice.organization.id,
      sendDate: data.sendDate ? format(new Date(data.sendDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    })
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={isSubmitting}
      >
        SEND
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Send Invoice</h3>
          <p className="py-4"> Do you want to send this invoice?</p>
          <Controller
            control={control}
            rules={{ validate: (value) => !value || dateStringValidation(value) }}
            name="sendDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <div className="flex items-center">
                <InputMask
                  mask="9999-99-99"
                  disabled={isSubmitting}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value ?? ''}
                  id="end"
                  type="text"
                  size={10}
                  className="input input-bordered py-1"
                />
                <CalendarSelector
                  disabled={isSubmitting}
                  className="shrink-0 pl-1"
                  date={getDate(value)}
                  hideLabel={true}
                  onDateChange={(newDate) => setValue('sendDate', format(newDate, 'yyyy-MM-dd'))}
                />
              </div>
            )}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={isSubmitting}>
                Cancel
              </button>
            </form>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleSubmit(handleSendInvoice)}
              disabled={isSubmitting}
            >
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
