import { format } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPen, FaPrint } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { InvoiceItemList } from './invoiceItemList'

const InvoiceDetailsFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    invoiceStatus
    invoiceWorkFrom
    invoiceWorkUntil
    ...InvoiceListInvoice
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
    formState: { errors },
    register,
  } = useForm<Pick<InvoiceUpdateInput, 'customerName' | 'customerAddress'>>({})
  const [{ fetching }, updateInvoice] = useMutation(InvoiceUpdateMutationDocument)
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})

  const handleSubmitHelper = async (
    handleSubmitHelperField: 'customerName' | 'customerAddress',
    data: Pick<InvoiceUpdateInput, typeof handleSubmitHelperField>,
  ) => {
    const result = await updateInvoice({ id: invoice.id, data })
    if (result.error) setError(handleSubmitHelperField, { message: 'Network error' })
  }

  const handleBlur = (handleBlurField: 'customerName' | 'customerAddress') => {
    setIsEditing((previous) => ({ ...previous, [handleBlurField]: false }))
  }

  const renderEditableField = (editableField: 'customerName' | 'customerAddress') =>
    isEditing[editableField] ? (
      <InputField
        {...register(editableField, { required: editableField === 'customerName' })}
        onBlur={() => {
          handleSubmit((data) => handleSubmitHelper(editableField, { [editableField]: data[editableField] }))()
          handleBlur(editableField)
        }}
        loading={fetching}
        errorMessage={errors[editableField]?.message}
        defaultValue={invoice[editableField] ?? ''}
        className="input-sm"
      />
    ) : (
      <p className="h-8">
        {invoice[editableField]}
        <button
          className="btn btn-square btn-ghost btn-xs ml-1 print:hidden"
          onClick={() => setIsEditing((previous) => ({ ...previous, [editableField]: true }))}
        >
          <FaPen />
        </button>
      </p>
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
            <p className="text-sm text-gray-600">Invoice No: #{invoice.id}</p>
            <p className="text-right text-sm">
              {invoice.invoiceWorkFrom} - {invoice.invoiceWorkUntil}
            </p>
            <p className="text-right text-sm text-gray-600">Created on: {formattedInvoiceDate}</p>
          </div>
        </div>
      </div>
      <InvoiceItemList invoice={invoice} invoiceItems={invoice.invoiceItems} />
      <div>
        <p className="font-bold">
          Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
        </p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
