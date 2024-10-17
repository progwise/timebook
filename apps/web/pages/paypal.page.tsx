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

// function createSubscription() {
//   return fetch('/api/paypal', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       // items: [
//       //   { id: 1, quantity: 1 },
//       //   { id: 2, quantity: 2 },
//       // ],
//     }),
//   })
//     .then((response) => response.json())
//     .then((subscription) => {
//       return subscription.id
//     })
// }

// function onApprove(data: any) {
//   return fetch('/api/paypal', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       orderID: data.orderID,
//     }),
//   })
//     .then((response) => response.json())
//     .then((orderData) => {
//       alert('Transaction completed by ' + orderData.payer.name.given_name)
//     })
// }

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

const PayPalPage = (): JSX.Element => {
  // eslint-disable-next-line unicorn/no-null
  const [planId, setPlanId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/paypal', { method: 'POST' })
      .then((response) => response.json())
      .then((data) => setPlanId(data.planId))
  }, [])

  const initialOptions: ReactPayPalScriptOptions = {
    clientId:
      // process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
      'AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1',
    vault: true,
    intent: 'subscription',
  }

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] = (data, actions) => {
    return actions.subscription.create({
      plan_id: planId!,
    })
  }

  // console.log(planId)

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
