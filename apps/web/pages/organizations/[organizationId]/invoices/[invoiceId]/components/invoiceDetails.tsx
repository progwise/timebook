import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaArrowRotateRight, FaPen, FaPrint } from 'react-icons/fa6'
import InputMask from 'react-input-mask'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { CalendarSelector } from '../../../../../../frontend/components/calendarSelector'
import { getDate } from '../../../../../../frontend/components/dateStringValidation'
import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { invoiceUpdateInputSchema } from '../../invoiceInputUpdateSchema'
import { InvoiceActionButtons } from './invoiceActionButtons'
import { InvoiceItemList } from './invoiceItemList'

const InvoiceDetailsFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    invoiceStatus
    organization {
      id
    }
    invoiceWorkFrom
    invoiceWorkUntil
    invoiceItems {
      id
    }
    ...InvoiceItemListInvoice
    ...InvoiceActionButtons
  }
`)

const InvoiceUpdateMutationDocument = graphql(`
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!, $action: InvoiceAction) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data, action: $action) {
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
    formState: { isSubmitting, errors },
    setValue,
    register,
    getValues,
    control,
    handleSubmit,
    clearErrors,
  } = useForm<InvoiceUpdateInput>({
    resolver: zodResolver(invoiceUpdateInputSchema),
    defaultValues: {
      organizationId: invoice.organization.id,
      customerName: invoice.customerName,
      customerAddress: invoice.customerAddress,
      invoiceWorkFrom: invoice.invoiceWorkFrom,
      invoiceWorkUntil: invoice.invoiceWorkUntil,
    },
  })
  const [{ fetching }, updateInvoice] = useMutation(InvoiceUpdateMutationDocument)
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})

  const handleSubmitForm = async (data: InvoiceUpdateInput) => {
    const updateInvoiceResult = await updateInvoice({
      id: invoice.id,
      organizationId: invoice.organization.id,
      data,
    })
    if (updateInvoiceResult.error) {
      setError('root', { message: 'Network error' })
    } else {
      clearErrors('root')
      setIsEditing({})
    }
  }

  const renderEditableField = (editableField: 'customerName' | 'customerAddress') =>
    isEditing[editableField] ? (
      <InputField
        {...register(editableField, {
          required: editableField === 'customerName',
        })}
        onBlur={handleSubmit(() => handleSubmitForm({ [editableField]: getValues(editableField) }))}
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

  const renderEditableDateField = (editableDateField: 'invoiceWorkFrom' | 'invoiceWorkUntil') =>
    isEditing[editableDateField] ? (
      <>
        <Controller
          control={control}
          name={editableDateField}
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-1">
              <InputMask
                disabled={isSubmitting}
                mask="9999-99-99"
                onBlur={handleSubmit(() => handleSubmitForm({ [editableDateField]: getValues(editableDateField) }))}
                onChange={onChange}
                value={value ?? invoice[editableDateField] ?? ''}
                id={editableDateField}
                type="text"
                size={10}
                className="input input-xs input-bordered"
              />
              <CalendarSelector
                disabled={isSubmitting}
                className="btn-xs"
                date={getDate(value)}
                hideLabel={true}
                onDateChange={(newDate) => {
                  setValue(editableDateField, format(newDate, 'yyyy-MM-dd'))
                  handleSubmit(() => handleSubmitForm({ [editableDateField]: getValues(editableDateField) }))()
                }}
              />
            </div>
          )}
        />
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

  const renderEditableDateFields = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-start gap-1">
        {renderEditableDateField('invoiceWorkFrom')} - {renderEditableDateField('invoiceWorkUntil')}
      </div>
      <div className="flex justify-start gap-4">
        {errors.invoiceWorkFrom && (
          <ErrorMessage
            name="invoiceWorkFrom"
            errors={errors}
            as={<span role="alert" className="label-text-alt text-error" />}
          />
        )}
        {errors.invoiceWorkUntil && (
          <ErrorMessage
            name="invoiceWorkUntil"
            errors={errors}
            as={<span role="alert" className="label-text-alt text-error" />}
          />
        )}
      </div>
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
          <div className="flex justify-end">
            <button
              className="btn btn-primary btn-sm mr-2 print:hidden"
              onClick={handleSubmit(handleSubmitForm)}
              disabled={fetching}
            >
              <FaArrowRotateRight className={fetching ? 'animate-spin' : ''} />
              Update
            </button>
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
            <p>Created on: {formattedInvoiceDate}</p>
            {renderEditableDateFields()}
          </div>
        </div>
      </div>
      <InvoiceItemList invoice={invoice} />
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">
            Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
          </p>
          <p>Thank you for your business!</p>
        </div>
        <InvoiceActionButtons invoice={invoice} />
      </div>
    </div>
  )
}
