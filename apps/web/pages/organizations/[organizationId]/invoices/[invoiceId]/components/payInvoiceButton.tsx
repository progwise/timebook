import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { CalendarSelector } from '../../../../../../frontend/components/calendarSelector'
import { dateStringValidation, getDate } from '../../../../../../frontend/components/dateStringValidation'
import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { invoiceUpdateInputSchema } from '../../invoiceInputUpdateSchema'

const InvoicePayButtonFragment = graphql(`
  fragment InvoicePayButton on Invoice {
    id
    customerName
    sendDate
    organization {
      id
    }
  }
`)

interface InvoicePayButtonProps {
  invoice: FragmentType<typeof InvoicePayButtonFragment>
  onSubmit: (data: InvoiceUpdateInput) => Promise<void>
}

export const PayInvoiceButton = ({ invoice: InvoiceFragment, onSubmit }: InvoicePayButtonProps): JSX.Element => {
  const invoice = useFragment(InvoicePayButtonFragment, InvoiceFragment)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InvoiceUpdateInput>({
    resolver: zodResolver(invoiceUpdateInputSchema),
    defaultValues: {
      payDate: format(new Date(), 'yyyy-MM-dd'),
      invoiceId: invoice.id,
      organizationId: invoice.organization.id,
      sendDate: invoice.sendDate,
    },
  })

  const handlePayInvoice = async (data: InvoiceUpdateInput) => {
    await onSubmit({
      ...data,
      invoiceId: data.invoiceId,
      organizationId: data.organizationId,
      payDate: data.payDate,
    })
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-primary btn-sm print:hidden"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={isSubmitting || !invoice.sendDate}
      >
        Pay
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Pay Invoice</h3>
          <form onSubmit={handleSubmit(handlePayInvoice)} className="contents" id="pay-invoice-form">
            <Controller
              control={control}
              rules={{ validate: (value) => !value || dateStringValidation(value) }}
              name="payDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <div>
                  <div className="flex items-center">
                    <p className="py-4"> When do you want to mark this invoice as paid for {invoice.customerName}?</p>
                    <InputMask
                      mask="9999-99-99"
                      disabled={isSubmitting}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="pay"
                      type="text"
                      size={10}
                      className="input input-sm input-bordered"
                    />
                  </div>
                  <CalendarSelector
                    disabled={isSubmitting}
                    date={getDate(value)}
                    hideLabel
                    onDateChange={(newDate) => setValue('payDate', format(newDate, 'yyyy-MM-dd'))}
                    alwaysOpen
                  />
                </div>
              )}
            />
            <div className="label">
              <ErrorMessage
                name="payDate"
                errors={errors}
                as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
              />
            </div>
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={isSubmitting}>
                Cancel
              </button>
            </form>
            <button
              className="btn btn-success btn-sm"
              onClick={handleSubmit(handlePayInvoice)}
              disabled={isSubmitting}
              form="pay-invoice-form"
            >
              Pay
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
