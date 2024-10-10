import Head from 'next/head'
import { useEffect, useState } from 'react'

import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'

const PayPalPage = (): JSX.Element => {
  // const [paidFor, setPaidFor] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // let paypalRef = useRef()

  // const product = {
  //   price: 777.77,
  //   description: 'chair'
  // }

  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1'
    script.addEventListener('load', () => {
      window.paypal
        .Buttons({
          createOrder: async () => {
            const response = await fetch('/api/paypal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                items: [
                  { id: 1, quantity: 1 },
                  { id: 2, quantity: 1 },
                ],
              }),
            })
            const order = await response.json()
            return order.id
          },
          onApprove: (_data, actions) => {
            return actions.order.capture().then((details) => {
              alert('Transaction completed by ' + details.payer.name.given_name)
            })
          },
        })
        .render('#paypal-button-container')
      setIsLoaded(false)
    })
    document.body.append(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <ProtectedPage>
      <Head>
        <title>PayPal Integration | Timebook</title>
        <meta name="description" content="PayPal integration page" />
      </Head>
      <PageHeading>PayPal Integration</PageHeading>
      <div id="paypal-button-container" />
      {/* {paidFor ? (
        <h1>Thank you for your purchase!</h1>
      ) : (<div><h1>{product.description} for ${product.price}</h1></div>)} */}
    </ProtectedPage>
  )
}

export default PayPalPage
