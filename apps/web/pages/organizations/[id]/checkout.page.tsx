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

const organizationPaypalPlanIdCreateMutationDocument = graphql(`
  mutation organizationPaypalPlanIdCreate($organizationId: ID!) {
    organizationPaypalPlanIdCreate(organizationId: $organizationId) {
      id
      paypalPlanId
      subscriptionExpiresAt
    }
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

  const [{ error }, paypalPlanCreate] = useMutation(organizationPaypalPlanIdCreateMutationDocument)

  const initialOptions: ReactPayPalScriptOptions = {
    clientId:
      // 'AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1',
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    vault: true,
    intent: 'subscription',
  }

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = async (_data, actions) => {
    const { data } = await paypalPlanCreate({ organizationId: organizationId!.toString() })
    if (!data?.organizationPaypalPlanIdCreate.paypalPlanId) {
      throw new Error('Failed to create subscription')
    }
    return actions.subscription.create({
      plan_id: data.organizationPaypalPlanIdCreate.paypalPlanId,
      custom_id: organizationId!.toString(),
    })
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
