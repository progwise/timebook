import paypal from '@paypal/checkout-server-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

const Environment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!),
)

const storeItems = new Map([
  [1, { price: 100, name: 'Learn React Today' }],
  [2, { price: 200, name: 'Learn CSS Today' }],
  // ['org_subscription', { price: 9.99, name: 'Monthly Organization Subscription' }],
])

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const paypalRequest = new paypal.orders.OrdersCreateRequest()
    let total = 0
    const items = request.body.items || []
    for (const item of items) {
      const storeItem = storeItems.get(Number(item.id))
      if (storeItem) {
        total += storeItem.price * item.quantity
      }
    }

    paypalRequest.prefer('return=representation')
    paypalRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total.toString(),
              },
              shipping: {
                currency_code: 'USD',
                value: '0.00',
              },
              handling: {
                currency_code: 'USD',
                value: '0.00',
              },
              tax_total: {
                currency_code: 'USD',
                value: '0.00',
              },
              insurance: {
                currency_code: 'USD',
                value: '0.00',
              },
              shipping_discount: {
                currency_code: 'USD',
                value: '0.00',
              },
              discount: {
                currency_code: 'USD',
                value: '0.00',
              },
            },
          },
          items: items.map((item: { id: number; quantity: number }) => {
            const storeItem = storeItems.get(item.id)
            return {
              name: storeItem?.name,
              unit_amount: {
                currency_code: 'USD',
                value: storeItem?.price.toString(),
              },
              quantity: item.quantity,
            }
          }),
        },
      ],
    })

    try {
      const order = await paypalClient.execute(paypalRequest)
      response.status(200).json({ id: order.result.id })
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.setHeader('Allow', ['POST'])
    response.status(405).end(`Method ${request.method} Not Allowed`)
  }
}
