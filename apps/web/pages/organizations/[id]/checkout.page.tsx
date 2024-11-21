import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import { addMonths, format } from 'date-fns'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'urql'

import { PageHeading } from '../../../frontend/components/pageHeading'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { graphql } from '../../../frontend/generated/gql'

const organizationPaypalSubscriptionIdCreateMutationDocument = graphql(`
  mutation organizationPaypalSubscriptionIdCreate($organizationId: ID!, $returnUrl: String!, $cancelUrl: String!) {
    organizationPaypalSubscriptionIdCreate(
      organizationId: $organizationId
      returnUrl: $returnUrl
      cancelUrl: $cancelUrl
    )
  }
`)

const organizationDetailsQueryDocument = graphql(`
  query organizationDetails($organizationId: ID!) {
    organization(organizationId: $organizationId) {
      id
      title
    }
  }
`)

const CheckoutPage = (): JSX.Element => {
  const router = useRouter()
  const { id: organizationId } = router.query

  const [{ data: organizationData }] = useQuery({
    query: organizationDetailsQueryDocument,
    variables: { organizationId: organizationId!.toString() },
  })

  const [{ error }, paypalSubscriptionCreate] = useMutation(organizationPaypalSubscriptionIdCreateMutationDocument)

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    vault: true,
    intent: 'subscription',
  }

  const returnUrl = `/organizations/${organizationId}?status=subscriptionSuccess`
  const errorUrl = `/organizations/${organizationId}?status=subscriptionError`
  const cancelUrl = `/organizations/${organizationId}?status=subscriptionCancel`

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = async () => {
    const { data } = await paypalSubscriptionCreate({
      organizationId: organizationId!.toString(),
      returnUrl,
      cancelUrl,
    })
    if (!data?.organizationPaypalSubscriptionIdCreate) {
      throw new Error('Failed to create subscription')
    }
    return data.organizationPaypalSubscriptionIdCreate
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async () => {
    await router.push(returnUrl)
  }

  const onError: PayPalButtonsComponentProps['onError'] = async () => {
    await router.push(errorUrl)
  }

  const onCancel: PayPalButtonsComponentProps['onCancel'] = async () => {
    await router.push(cancelUrl)
  }

  const startDate = new Date()
  const endDate = addMonths(startDate, 1)

  return (
    <ProtectedPage>
      <PageHeading>Upgrade to Pro plan for {organizationData?.organization.title}</PageHeading>
      <div>
        <p>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d yyyy')}
        </p>
        <p>Total price: 10 EUR</p>
      </div>
      <div className="max-w-96">
        {error && <span>Error: {error.message}</span>}
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            createSubscription={createSubscription}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            style={{ layout: 'vertical' }}
          />
        </PayPalScriptProvider>
      </div>
    </ProtectedPage>
  )
}

export default CheckoutPage
