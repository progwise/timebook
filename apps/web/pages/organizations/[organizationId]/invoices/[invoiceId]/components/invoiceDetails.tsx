import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { FaPrint } from 'react-icons/fa6'

import { InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    payDate
    sendDate
    invoiceStatus
  }
`)

const InvoiceItemsFragment = graphql(`
  fragment InvoiceItemsFragment on InvoiceItem {
    id
    duration
    hourlyRate
    task {
      id
      title
    }
  }
`)

interface InvoiceDetailsProps {
  invoice: FragmentType<typeof InvoiceFragment>
  invoiceItems: FragmentType<typeof InvoiceItemsFragment>[]
}

export const InvoiceDetails = ({ invoice, invoiceItems }: InvoiceDetailsProps) => {
  const invoiceData = useFragment(InvoiceFragment, invoice)
  const invoiceItemsData = useFragment(InvoiceItemsFragment, invoiceItems)
  const tasks = invoiceItemsData.map((item) => item.task)
  const {
    register,
    formState: { isSubmitting, dirtyFields },
  } = useForm<InvoiceItemInput>()

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 shadow-md">
      <div className="flex justify-between text-sm">
        <div className="flex flex-col gap-4">
          <div>
            <Image className="m-auto" src="/logo-progwise.svg" alt="Progwise logo" width={60} height={60} />
            <p className="text-lg font-bold">Progwise</p>
            <p>Greifswald</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Billed to:</h2>
            <p>{invoiceData.customerName}</p>
            <p>{invoiceData.customerAddress}</p>
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
              <span className="badge badge-neutral badge-lg">{invoiceData.invoiceStatus}</span>
            </div>
            <p className="text-sm text-gray-600">Invoice No: #{invoiceData.id}</p>
            <p className="text-right text-sm text-gray-600">Invoice Date: {invoiceData.invoiceDate}</p>
          </div>
        </div>
      </div>

      <table className="table size-full border-collapse border border-neutral">
        <thead className="bg-neutral text-sm text-neutral-content">
          <tr>
            <th>Item</th>
            <th>Duration</th>
            <th>Hourly Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItemsData.map((invoiceItem) => (
            <tr key={invoiceItem.id}>
              <td className="border border-neutral">{invoiceItem.task.title}</td>
              <td className="border border-neutral">{invoiceItem.duration}</td>
              <td className="border border-neutral">{invoiceItem.hourlyRate}</td>
              <td className="border border-neutral">{invoiceItem.duration * invoiceItem.hourlyRate}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-sm text-base-content">
          <tr className="font-normal">
            <td>
              <select
                className={`select select-bordered w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                {...register('taskId', { disabled: isSubmitting })}
              >
                <option value="">Choose the task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <form>
                <InputField placeholder="duration input field" />
              </form>
            </td>
            <td>
              <form>
                <InputField placeholder="hourly rate input field" />
              </form>
            </td>
            <td>amount (autocalculated)</td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-neutral" />
            <td className="border border-neutral">Total</td>
            <td className="border border-neutral">
              €{invoiceItemsData.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
            </td>
          </tr>
        </tfoot>
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
