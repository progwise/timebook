import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import Head from 'next/head'
import { useEffect, useState } from 'react'

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
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    vault: true,
    intent: 'subscription',
  }

  // eslint-disable-next-line unicorn/no-null
  const [planId, setPlanId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanId = async () => {
      try {
        const response = await fetch('/api/paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        // debugger

        if (!response.ok) {
          throw new Error('Plan id fetch response is not ok')
        }
        const data = await response.json()
        setPlanId(data.id)
      } catch (error) {
        alert(error)
      }
    }

    fetchPlanId()
  }, [])

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = (data, actions) => {
    // debugger
    // console.log('planId', planId)
    if (!planId) {
      throw new Error('Plan ID not available')
    }

    return actions.subscription.create({
      plan_id: planId,
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
        {planId && (
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createSubscription={createSubscription}
              onApprove={onApprove}
              onError={onError}
              onCancel={onCancel}
              style={{ layout: 'vertical' }}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </ProtectedPage>
  )
}

export default PayPalPage
