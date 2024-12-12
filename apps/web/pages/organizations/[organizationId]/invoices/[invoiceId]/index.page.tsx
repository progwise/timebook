import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { ProtectedPage } from '../../../../../frontend/components/protectedPage'
import { graphql } from '../../../../../frontend/generated/gql'
import { InvoiceDetails } from './components/invoiceDetails'

const InvoiceQueryDocument = graphql(`
  query invoice($invoiceId: ID!, $organizationId: ID!) {
    invoice(invoiceId: $invoiceId, organizationId: $organizationId) {
      ...InvoiceFragment
      invoiceItems {
        ...InvoiceItemsFragment
      }
    }
  }
`)

const InvoiceDetailsPage = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Organization'] }), [])
  const router = useRouter()
  const { invoiceId, organizationId } = router.query
  const [{ data: invoiceDetailData, error, fetching }] = useQuery({
    query: InvoiceQueryDocument,
    context,
    variables: { invoiceId: invoiceId?.toString() ?? '', organizationId: organizationId?.toString() ?? '' },
    pause: !router.isReady,
  })

  return (
    <ProtectedPage>
      {error && <span>{error.message}</span>}
      {fetching && <span className="loading loading-spinner" />}
      {invoiceDetailData && (
        <div className="flex flex-col gap-4">
          <InvoiceDetails invoice={invoiceDetailData.invoice} invoiceItems={invoiceDetailData.invoice.invoiceItems} />
        </div>
      )}
    </ProtectedPage>
  )
}

export default InvoiceDetailsPage
