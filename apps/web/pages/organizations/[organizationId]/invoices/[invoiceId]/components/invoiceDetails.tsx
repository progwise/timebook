import Image from 'next/image'
import { FaPrint } from 'react-icons/fa6'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'

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
  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 shadow-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <Image className="m-auto" src="/logo-progwise.svg" alt="Progwise logo" width={60} height={60} />
            <p className="text-lg font-bold">Progwise</p>
            <p className="text-sm">Greifswald</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Billed to:</h2>
            <p className="text-sm">{invoiceData.customerName}</p>
            <p className="text-sm">{invoiceData.customerAddress}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div className="text-right">
            <button className="btn btn-primary btn-sm print:hidden" onClick={() => print()}>
              <FaPrint />
              Print
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-sm text-gray-600">Invoice No: #{invoiceData.id}</p>
            <p className="text-right text-sm text-gray-600">Invoice Date: {invoiceData.invoiceDate}</p>
          </div>
        </div>
      </div>

      <table className="size-full border-collapse border border-gray-200">
        <thead className="bg-gray-200 text-left text-sm">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Item</th>
            <th className="border border-gray-300 px-4 py-2">Duration</th>
            <th className="border border-gray-300 px-4 py-2">Hourly Rate</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItemsData.map((invoiceItem) => (
            <tr key={invoiceItem.id}>
              <td className="border border-gray-200 px-4 py-2">{invoiceItem.task.title}</td>
              <td className="border border-gray-200 px-4 py-2">{invoiceItem.duration}</td>
              <td className="border border-gray-200 px-4 py-2">{invoiceItem.hourlyRate}</td>
              <td className="border border-gray-200 px-4 py-2">{invoiceItem.duration * invoiceItem.hourlyRate}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-gray-200 px-4 py-2" colSpan={2} />
            <td className="border border-gray-200 px-4 py-2 font-bold">Total</td>
            <td className="border border-gray-200 px-4 py-2 font-bold">
              €{invoiceItemsData.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex">
        <div className="flex flex-col">
          <p className="text-sm font-bold">
            Payment method: <span className="font-normal">Bank Transfer/ PayPal</span>
          </p>
          <p className="text-sm">Thank you for your business!</p>
        </div>
        <div className="w-full text-right font-bold">
          Invoice status: <span className="font-normal">{invoiceData.invoiceStatus}</span>
        </div>
      </div>
    </div>
  )
}
