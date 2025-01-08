import Image from 'next/image'
import { FaPrint } from 'react-icons/fa6'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemList } from './invoiceItemList'

const InvoiceFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    invoiceStatus
    ...InvoiceListInvoice
    invoiceItems {
      id
      ...InvoiceItemsListInvoice
    }
  }
`)

export interface InvoiceDetailsProps {
  invoice: FragmentType<typeof InvoiceFragment>
}

export const InvoiceDetails = ({ invoice }: InvoiceDetailsProps) => {
  const invoiceData = useFragment(InvoiceFragment, invoice)

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 text-sm shadow-md">
      <div className="flex justify-between">
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
              <span className="badge badge-neutral badge-lg print:hidden">{invoiceData.invoiceStatus}</span>
            </div>
            <p>Invoice No: #{invoiceData.id}</p>
            <p className="text-right">Invoice Date: {invoiceData.invoiceDate}</p>
          </div>
        </div>
      </div>
      <InvoiceItemList invoice={invoiceData} invoiceItems={invoiceData.invoiceItems} />
      <div>
        <p className="font-bold">
          Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
        </p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
