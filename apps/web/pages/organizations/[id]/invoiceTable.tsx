import { FragmentType, graphql, useFragment } from '../../../frontend/generated/gql'

export const InvoiceTableItemFragment = graphql(`
  fragment InvoiceTableItem on Invoice {
    id
    invoiceDate
    customerName
    items {
      id
      duration
      hourlyRate
    }
  }
`)

interface InvoiceTableProps {
  invoices: FragmentType<typeof InvoiceTableItemFragment>[]
}

export const InvoiceTable = (props: InvoiceTableProps): JSX.Element => {
  const invoices = useFragment(InvoiceTableItemFragment, props.invoices)

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
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.customerName}</td>
              <td>{invoice.items.reduce((sum, item) => sum + item.duration, 0)}</td>
              <td>
                {invoice.items.some(
                  (item) => item.hourlyRate === null || item.hourlyRate === undefined || item.hourlyRate === 0,
                )
                  ? '-'
                  : invoice.items.reduce((sum, item) => sum + item.duration * item.hourlyRate!, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
