import { FragmentType, graphql, useFragment } from '../../../frontend/generated/gql'

export const InvoiceTableItemFragment = graphql(`
  fragment InvoiceTableItem on Invoice {
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
  invoices: FragmentType<typeof InvoiceTableItemFragment>[]
}

export const InvoiceTable = ({ invoices }: InvoiceTableProps): JSX.Element => {
  const invoicesData = useFragment(InvoiceTableItemFragment, invoices)

  return (
    <div>
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Hours</th>
            <th>Total amount</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
