import Image from 'next/image'
import { FaPrint } from 'react-icons/fa6'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'

const InvoiceFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
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
    <div className="rounded-lg p-6 shadow-md print:mt-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Image src="/logo-progwise.svg" alt="Progwise logo" width={60} height={60} />
          <p className="mt-2 text-lg font-bold">Progwise</p>
          <p className="text-sm">Greifswald</p>
        </div>
        <div className="text-right">
          <button className="btn btn-primary btn-sm print:hidden" onClick={() => print()}>
            <FaPrint />
            Print
          </button>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="mt-2 text-sm text-gray-600">Invoice No: #{invoiceData.id}</p>
        </div>
      </div>
      <div className="mb-6 grid w-full grid-cols-2">
        <div>
          <h2 className="text-lg font-bold">Billed to:</h2>
          <p className="text-sm">{invoiceData.customerName}</p>
          <p className="text-sm">{invoiceData.customerAddress}</p>
        </div>
        <p className="text-right text-sm text-gray-600">Invoice Date: {invoiceData.invoiceDate}</p>
      </div>
      <table className="mb-6 size-full border-collapse border border-gray-200">
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">
            Payment method: <span className="font-normal">Bank Transfer/ PayPal</span>
          </p>
          <p className="text-sm">Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}
