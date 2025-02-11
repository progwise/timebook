import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, isAfter, parseISO } from 'date-fns'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { invoiceSendInputValidations } from '@progwise/timebook-validations'

import { CalendarSelector } from '../../../../../../frontend/components/calendarSelector'
import { dateStringValidation, getDate } from '../../../../../../frontend/components/dateStringValidation'
import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceSendInput } from '../../../../../../frontend/generated/gql/graphql'

export const InvoiceSendButtonFragment = graphql(`
  fragment SendInvoiceButton on Invoice {
    id
    customerName
    organization {
      id
    }
  }
`)

export const InvoiceSendInputSchema: z.ZodSchema<InvoiceSendInput> = invoiceSendInputValidations.extend({
  sendDate: z
    .string()
    .min('____-__-__'.length, 'Enter a date')
    .refine((value) => value !== '____-__-__', 'Enter a date')
    .refine((value) => !value || isValid(parseISO(value)), 'Invalid date')
    .refine(
      (value) => !value || !isAfter(parseISO(value), new Date()),
      'Send date cannot be a future date. Please enter a valid date.',
    ),
})

export interface InvoiceSendButtonProps {
  invoice: FragmentType<typeof InvoiceSendButtonFragment>
  onSubmit: (data: InvoiceSendInput) => Promise<void>
}

export const SendInvoiceButton = ({ invoice: InvoiceFragment, onSubmit }: InvoiceSendButtonProps): JSX.Element => {
  const invoice = useFragment(InvoiceSendButtonFragment, InvoiceFragment)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InvoiceSendInput>({
    defaultValues: {
      sendDate: format(new Date(), 'yyyy-MM-dd'),
      invoiceId: invoice.id,
      organizationId: invoice.organization.id,
    },
    resolver: zodResolver(InvoiceSendInputSchema),
  })

  const handleSendInvoice = async (data: InvoiceSendInput) => {
    await onSubmit({
      ...data,
      invoiceId: data.invoiceId,
      organizationId: data.organizationId,
      sendDate: data.sendDate,
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
        Send
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Send Invoice</h3>
          <form onSubmit={handleSubmit(handleSendInvoice)} className="contents" id="send-invoice-form">
            <Controller
              control={control}
              rules={{ validate: (value) => !value || dateStringValidation(value) }}
              name="sendDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <div>
                  <div className="flex items-center">
                    <p className="py-4"> When do you want to send this invoice billed to {invoice.customerName}?</p>
                    <InputMask
                      mask="9999-99-99"
                      disabled={isSubmitting}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="end"
                      type="text"
                      size={10}
                      className="input input-sm input-bordered"
                    />
                  </div>
                  <CalendarSelector
                    disabled={isSubmitting}
                    date={getDate(value)}
                    hideLabel
                    onDateChange={(newDate) => setValue('sendDate', format(newDate, 'yyyy-MM-dd'))}
                    alwaysOpen
                  />
                </div>
              )}
            />
            <div className="label">
              <ErrorMessage
                name="sendDate"
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
              onClick={handleSubmit(handleSendInvoice)}
              disabled={isSubmitting}
              form="send-invoice-form"
            >
              Send
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
