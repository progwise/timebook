import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPen, FaPrint } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceUpdateInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceDetailsFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    payDate
    sendDate
    invoiceStatus
    invoiceItems {
      id
      duration
      hourlyRate
      task {
        title
      }
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

  const [isEditing, setIsEditing] = useState<{ customerName: boolean; customerAddress: boolean }>({
    customerName: false,
    customerAddress: false,
  })

  const handleSubmitHelper = async (
    field: 'customerName' | 'customerAddress',
    data: Pick<InvoiceUpdateInput, typeof field>,
  ) => {
    const result = await updateInvoice({ id: invoice.id, data })
    if (result.error) setError(field, { message: 'Network error' })
  }

  const handleBlur = (field: 'customerName' | 'customerAddress') => {
    setIsEditing((previous) => ({ ...previous, [field]: false }))
  }

  const renderEditableField = (field: 'customerName' | 'customerAddress') =>
    isEditing[field] ? (
      <InputField
        {...register(field, { required: field === 'customerName' })}
        onBlur={() => {
          handleSubmit((data) => handleSubmitHelper(field, { [field]: data[field] }))()
          handleBlur(field)
        }}
        loading={fetching}
        errorMessage={errors[field]?.message}
        defaultValue={invoice[field] ?? ''}
        className="input-sm"
      />
    ) : (
      <p className="h-8">
        {invoice[field]}
        <button
          className="btn btn-square btn-ghost btn-xs ml-1 print:hidden"
          onClick={() => setIsEditing((previous) => ({ ...previous, [field]: true }))}
        >
          <FaPen />
        </button>
      </p>
    )

  return (
    <div className="rounded-lg p-4 shadow-md">
      <div className="flex justify-between pb-4 text-sm">
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
            <p className="text-right">Invoice Date: {invoice.invoiceDate}</p>
          </div>
        </div>
      </div>

      <table className="table">
        <thead className="bg-neutral text-sm text-neutral-content">
          <tr>
            <th className="w-2/3 border border-neutral">Item</th>
            <th className="border border-neutral">Duration</th>
            <th className="border border-neutral">Hourly Rate</th>
            <th className="border border-neutral text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoiceItems.map((invoiceItem) => (
            <tr key={invoiceItem.id}>
              <td className="border border-neutral">{invoiceItem.task.title}</td>
              <td className="border border-neutral">{invoiceItem.duration}</td>
              <td className="border border-neutral">{invoiceItem.hourlyRate}</td>
              <td className="border border-neutral text-right">{invoiceItem.duration * invoiceItem.hourlyRate}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan={2} />
            <td className="text-right">Total</td>
            <td className="text-right">
              € {invoice.invoiceItems.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-sm">
        <p className="font-bold">
          Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
        </p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
