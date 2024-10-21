import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import Head from 'next/head'

import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'

const onApprove: PayPalButtonsComponentProps['onApprove'] = async (data) => {
  alert(`You have successfully subscribed to ${data.subscriptionID}`)
}

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
  const initialOptions: ReactPayPalScriptOptions = {
    clientId:
      // process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      'AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1',
    vault: true,
    intent: 'subscription',
  }

  // const [planId, setPlanId] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchPlanId = async () => {
  //     try {
  //       const response = await fetch('/api/paypal')
  //       const data = await response.json()
  //       setPlanId(data.planId)
  //     } catch (error) {
  //       console.error('Error fetching plan ID:', error)
  //     }
  //   }

  //   fetchPlanId()
  // }, [])

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = (data, actions) => {
    // if (!planId) {
    //   throw new Error('Plan ID not available')
    // }
    return actions.subscription.create({
      plan_id: 'P-7SY61338S60159730M4JC7WI',
    })
  }

  return (
    <ProtectedPage>
      <Head>
        <title>PayPal Integration | Timebook</title>
        <meta name="description" content="PayPal integration page" />
      </Head>
      <PageHeading>PayPal Integration</PageHeading>
      <div style={{ maxWidth: '750px', minHeight: '200px' }}>
        {/* {planId && ( */}
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            createSubscription={createSubscription}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            style={{ layout: 'vertical' }}
          />
        </PayPalScriptProvider>
        {/* )} */}
      </div>
    </ProtectedPage>
  )
}

export default PayPalPage
