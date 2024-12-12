import Link from 'next/link'
import { useRouter } from 'next/router'

import { FragmentType, graphql, useFragment } from '../../../../frontend/generated/gql'

export const InvoiceFragment = graphql(`
  fragment Invoice on Invoice {
    id
    invoiceDate
    customerName
    invoiceItems {
      id
      duration
      hourlyRate
    }
  }
`)

interface InvoiceTableProps {
  invoices: FragmentType<typeof InvoiceFragment>[]
}

export const InvoiceTable = ({ invoices }: InvoiceTableProps): JSX.Element => {
  const router = useRouter()
  const invoicesData = useFragment(InvoiceFragment, invoices)

  return (
    <div>
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Hours</th>
            <th>Total amount</th>
            <th />
          </tr>
        </thead>
        <tbody className="text-base">
          {invoicesData.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.customerName}</td>
              <td>{invoice.invoiceItems.reduce((sum, invoiceItem) => sum + invoiceItem.duration, 0)}</td>
              <td>
                {invoice.invoiceItems.reduce(
                  (sum, invoiceItem) => sum + invoiceItem.duration * invoiceItem.hourlyRate,
                  0,
                )}
              </td>
              <td className="text-right">
                <Link
                  className="btn btn-outline btn-secondary btn-sm"
                  href={`/organizations/${router.query.organizationId}/invoices/${invoice.id}`}
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
