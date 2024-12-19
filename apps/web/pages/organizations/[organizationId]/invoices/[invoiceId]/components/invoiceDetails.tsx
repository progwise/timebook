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
          <div className="flex self-end">
            <button className="btn btn-primary btn-sm print:hidden">Send</button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p>Invoice No: #{invoiceData.id}</p>
            <p className="text-right">Invoice Date: {invoiceData.invoiceDate}</p>
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
          <tr className="font-bold">
            <td colSpan={2} className="border border-neutral" />
            <td className="border border-neutral">Total</td>
            <td className="border border-neutral">
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
