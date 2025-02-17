import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaPen, FaPrint } from 'react-icons/fa6'
import InputMask from 'react-input-mask'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { CalendarSelector } from '../../../../../../frontend/components/calendarSelector'
import { dateStringValidation, getDate } from '../../../../../../frontend/components/dateStringValidation'
import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceSendInput, InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { invoiceInputSchema } from '../../invoiceInputSchema'
import { InvoiceItemList } from './invoiceItemList'
import { SendOrWithdrawInvoiceButton } from './sendOrWithdrawInvoiceButton'

const SendInvoiceMutationDocument = graphql(`
  mutation sendInvoice($data: InvoiceSendInput!) {
    sendInvoice(data: $data) {
      id
    }
  }
`)

const InvoiceDetailsFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    invoiceStatus
    sendDate
    organization {
      id
    }
    invoiceWorkFrom
    invoiceWorkUntil
    ...InvoiceListInvoice
    ...SendOrWithdrawInvoice
    invoiceItems {
      id
      ...InvoiceItemsListInvoice
    }
  }
`)

const InvoiceUpdateMutationDocument = graphql(`
  mutation invoiceUpdate($id: ID!, $data: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, data: $data) {
      id
    }
  }
`)

interface InvoiceDetailsProps {
  invoice: FragmentType<typeof InvoiceDetailsFragment>
}

export const InvoiceDetails = ({ invoice: invoiceFragment }: InvoiceDetailsProps) => {
  const invoice = useFragment(InvoiceDetailsFragment, invoiceFragment)
  const {
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    register,
    control,
  } = useForm<Pick<InvoiceUpdateInput, 'customerName' | 'customerAddress' | 'invoiceWorkFrom' | 'invoiceWorkUntil'>>({
    resolver: zodResolver(invoiceInputSchema),
  })
  const [{ fetching }, updateInvoice] = useMutation(InvoiceUpdateMutationDocument)
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})
  const [, sendInvoice] = useMutation(SendInvoiceMutationDocument)
  const handleSubmitHelper = async (
    handleSubmitHelperField: 'customerName' | 'customerAddress' | 'invoiceWorkFrom' | 'invoiceWorkUntil',
    data: Pick<InvoiceUpdateInput, typeof handleSubmitHelperField>,
  ) => {
    const result = await updateInvoice({ id: invoice.id, data })
    if (result.error) setError(handleSubmitHelperField, { message: 'Network error' })
  }

  const handleBlur = (handleBlurField: 'customerName' | 'customerAddress' | 'invoiceWorkFrom' | 'invoiceWorkUntil') => {
    setIsEditing((previous) => ({ ...previous, [handleBlurField]: false }))
  }

  const renderEditableField = (editableField: 'customerName' | 'customerAddress') =>
    isEditing[editableField] ? (
      <InputField
        {...register(editableField, {
          required: editableField === 'customerName',
        })}
        onBlur={() => {
          handleSubmit((data) => handleSubmitHelper(editableField, { [editableField]: data[editableField] }))()
          handleBlur(editableField)
        }}
        loading={fetching}
        errorMessage={errors[editableField]?.message}
        defaultValue={invoice[editableField] ?? ''}
        className="input-xs"
      />
    ) : (
      <p className="flex h-6 items-center">
        {invoice[editableField]}
        <button
          className="btn btn-square btn-ghost btn-xs ml-1 print:hidden"
          onClick={() => setIsEditing((previous) => ({ ...previous, [editableField]: true }))}
        >
          <FaPen />
        </button>
      </p>
    )
  const handleSendOrWithdrawInvoice = async (data: InvoiceSendInput) => {
    try {
      await sendInvoice({
        data: {
          invoiceId: invoice.id,
          organizationId: invoice.organization.id,
          sendDate: data.sendDate,
        },
      })
    } catch {}
  }
  const renderEditableDateField = (editableDateField: 'invoiceWorkFrom' | 'invoiceWorkUntil') =>
    isEditing[editableDateField] ? (
      <>
        <Controller
          control={control}
          rules={{ validate: (value) => !value || dateStringValidation(value) }}
          name={editableDateField}
          render={({ field: { onChange, onBlur, value } }) => (
            <div className="flex gap-1">
              <InputMask
                disabled={isSubmitting}
                mask="9999-99-99"
                onBlur={() => {
                  onBlur()
                  handleSubmit((data) =>
                    handleSubmitHelper(editableDateField, { [editableDateField]: data[editableDateField] }),
                  )()
                  handleBlur(editableDateField)
                }}
                onChange={onChange}
                value={value ?? invoice[editableDateField] ?? ''}
                id={editableDateField}
                type="text"
                size={9}
                className="input input-xs input-bordered"
              />
              <CalendarSelector
                disabled={isSubmitting}
                className="btn-xs"
                date={getDate(value)}
                hideLabel={true}
                onDateChange={(newDate) => setValue(editableDateField, format(newDate, 'yyyy-MM-dd'))}
              />
            </div>
          )}
        />
        {errors[editableDateField] && (
          <ErrorMessage
            name={editableDateField}
            errors={errors}
            as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
          />
        )}
      </>
    ) : (
      <div className="flex items-center">
        <p>{invoice[editableDateField]}</p>
        <button
          className="btn btn-square btn-ghost btn-xs print:hidden"
          onClick={() => setIsEditing((previous) => ({ ...previous, [editableDateField]: true }))}
        >
          <FaPen />
        </button>
      </div>
    )

  const formattedInvoiceDate = format(new Date(invoice.invoiceDate ?? ''), 'd MMMM yyyy')

  return (
    <div className="rounded-lg p-4 text-sm shadow-md">
      <div className="flex justify-between pb-4">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Image className="m-auto" src="/logo-progwise.svg" alt="Progwise logo" width={60} height={60} />
            <p className="text-lg font-bold">Progwise</p>
            <p>Greifswald</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Billed to:</h2>
            {renderEditableField('customerName')}
            {renderEditableField('customerAddress')}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-right">
            <button className="btn btn-primary btn-sm print:hidden" onClick={() => print()}>
              <FaPrint />
              Print
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">Invoice</div>
              <span className="badge badge-neutral badge-lg print:hidden">{invoice.invoiceStatus}</span>
            </div>
            <p>Invoice No: #{invoice.id}</p>
            <div className="flex items-center justify-end gap-1">
              {renderEditableDateField('invoiceWorkFrom')} - {renderEditableDateField('invoiceWorkUntil')}
            </div>
            <p className="text-right">Created on: {formattedInvoiceDate}</p>
          </div>
        </div>
      </div>
      <InvoiceItemList invoice={invoice} invoiceItems={invoice.invoiceItems} />
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">
            Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
          </p>
          <p>Thank you for your business!</p>
        </div>
        <SendOrWithdrawInvoiceButton invoice={invoice} onSubmit={handleSendOrWithdrawInvoice} />
      </div>
    </div>
  )
}
