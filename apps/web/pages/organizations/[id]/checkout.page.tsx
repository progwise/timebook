import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { PageHeading } from '../../../frontend/components/pageHeading'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { graphql } from '../../../frontend/generated/gql'

const organizationPaypalSubscriptionIdCreateMutationDocument = graphql(`
  mutation organizationPaypalSubscriptionIdCreate($organizationId: ID!) {
    organizationPaypalSubscriptionIdCreate(organizationId: $organizationId)
  }
`)

function onError() {
  // window.location.assign('/error-page')
  alert('An error has occured')
}

function onCancel() {
  // window.location.assign('/error-page')
  alert('A cancel has occured')
}

// const PayPalButtonWrapper = () => {
//   const [{ options }, dispatch] = usePayPalScriptReducer()
//   const [currency, setCurrency] = useState(options.currency)

//   function onCurrencyChange({ target: { value } }: any) {
//     setCurrency(value)
//     dispatch({ type: 'resetOptions', value: { ...options, currency: value } })
//   }

//   return (
//     <>
//       <select value={currency} onChange={onCurrencyChange}>
//         <option value="USD">US Dollar</option>
//         <option value="EUR">Euro</option>
//       </select>

//       <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: 'vertical' }} />
//     </>
//   )
// }

const PayPalPage = (): JSX.Element => {
  const router = useRouter()
  const { id: organizationId } = router.query

  const [{ error }, paypalSubscriptionCreate] = useMutation(organizationPaypalSubscriptionIdCreateMutationDocument)

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    vault: true,
    intent: 'subscription',
  }

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = async () => {
    const { data } = await paypalSubscriptionCreate({ organizationId: organizationId!.toString() })
    if (!data?.organizationPaypalSubscriptionIdCreate) {
      throw new Error('Failed to create subscription')
    }
    return data.organizationPaypalSubscriptionIdCreate
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async () => {
    await router.push(`/organizations/${organizationId}?subscriptionSuccess=true`)
  }

  return (
    <ProtectedPage>
      <PageHeading>PayPal Integration</PageHeading>
      <div style={{ maxWidth: '750px', minHeight: '200px' }}>
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

export default PayPalPage
