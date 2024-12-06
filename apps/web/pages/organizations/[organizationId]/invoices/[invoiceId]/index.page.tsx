import { useRouter } from 'next/router'
import { useQuery } from 'urql'

import { ProtectedPage } from '../../../../../frontend/components/protectedPage'
import { graphql } from '../../../../../frontend/generated/gql'

const InvoiceQueryDocument = graphql(`
  query invoice($invoiceId: ID!) {
    invoice(invoiceId: $invoiceId) {
      id
      #   ...InvoiceRow
    }
  }
`)

const InvoiceDetails = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  //   const context = useMemo(() => ({ additionalTypenames: ['Invoice', 'User', 'Organization', 'WorkHour'] }), [])
  const [{ data, error, fetching }] = useQuery({
    query: InvoiceQueryDocument,
    variables: { invoiceId: id?.toString() ?? '' },
    // context,
    pause: !router.isReady,
  })
  return (
    <ProtectedPage>
      {/* <PageHeading>Invoice #{data?.invoice.id}</PageHeading>
      {error && <span>{error.message}</span>}
      {fetching && <span className="loading loading-spinner" />}
      {data && (
        <div>
          <table>
            <thead>
              <tr>
                <th>
                  Number
                </th>
              </tr>
            </thead>
          </table>
        </div>
      )} */}
      <div>Invoice form here</div>
      <div>Invoice items table here</div>
    </ProtectedPage>
  )
}

export default InvoiceDetails
