import { NextApiRequest, NextApiResponse } from 'next'

// const Environment = process.env.NODE_ENV === 'production' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment

// const paypalClient = new paypal.core.PayPalHttpClient(
//   new Environment(
//     process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
//       'AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1',
//     process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET ||
//       'EJ0xWsYcwdc7aYyAdBXJJcaN9HPpT6LKrhVY_055QaPYIKckqRn79UhV6TLKCos7oscd4T7fFuVLuFpF',
//   ),
// )

const storeItems = new Map([
  [1, { price: 100, name: 'Item one' }],
  [2, { price: 200, name: 'Item two' }],
  // ['org_subscription', { price: 9.99, name: 'Monthly Organization Subscription', plan_id: 'P-PLAN_ID' }],
])

async function getAccessToken() {
  const clientId =
    // process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    'AYcvyAIL8uS28byzWlowgR6pQgOyffZuOR-9e4gy6gl9I6BMRPOxqQf20tvyprzuj67iZfih5CBxqBk1'
  const clientSecret =
    // process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET ||
    'EJ0xWsYcwdc7aYyAdBXJJcaN9HPpT6LKrhVY_055QaPYIKckqRn79UhV6TLKCos7oscd4T7fFuVLuFpF'

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    // const paypalRequest = new paypal.orders.OrdersCreateRequest()
    const accessToken = await getAccessToken()
    const createProductResponse = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: 'Monthly Organization Subscription',
        // "description": "A monthly Organization Subscription",
        type: 'SERVICE',
        category: 'SOFTWARE',
        // "image_url": "https://example.com/streaming.jpg",
        // "home_url": "https://example.com/home"
      }),
    })

    console.log('Access token is', accessToken)
    if (!createProductResponse.ok) {
      console.log(await createProductResponse.json())
      throw new Error('Could not create product')
    }

    const product = await createProductResponse.json()

    const createPlanResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        product_id: product.id,
        name: 'Monthly Organization Subscription',
        // "description": "A monthly Organization Subscription",
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1,
            },
            tenure_type: 'TRIAL',
            sequence: 1,
            total_cycles: 1,
          },
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1,
            },
            tenure_type: 'REGULAR',
            sequence: 2,
            total_cycles: 12,
            pricing_scheme: {
              fixed_price: {
                value: '10',
                currency_code: 'USD',
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '10',
            currency_code: 'USD',
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
        // taxes: {
        //   percentage: "10",
        //   inclusive: false
        // }
      }),
    })

    if (!createProductResponse.ok) {
      throw new Error('Could not create plan')
    }

    const plan = await createPlanResponse.json()

    let total = 0
    const items = request.body.items || []
    for (const item of items) {
      const storeItem = storeItems.get(Number(item.id))
      if (storeItem) {
        total += storeItem.price * item.quantity
      }
    }

    // createProductResponse.prefer('return=representation')
    // createProductResponse.requestBody({
    //   intent: 'CAPTURE',
    //   purchase_units: [
    //     {
    //       amount: {
    //         currency_code: 'USD',
    //         value: total.toString(),
    //         breakdown: {
    //           item_total: {
    //             currency_code: 'USD',
    //             value: total.toString(),
    //           },
    //           shipping: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //           handling: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //           tax_total: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //           insurance: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //           shipping_discount: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //           discount: {
    //             currency_code: 'USD',
    //             value: '0.00',
    //           },
    //         },
    //       },
    //       items: items.map((item: { id: number; quantity: number }) => {
    //         const storeItem = storeItems.get(item.id)
    //         return {
    //           name: storeItem?.name,
    //           unit_amount: {
    //             currency_code: 'USD',
    //             value: storeItem?.price.toString(),
    //           },
    //           quantity: item.quantity,
    //         }
    //       }),
    //     },
    //   ],
    // })

    try {
      // const order = await paypalClient.execute(createProductResponse)
      // response.status(200).json({ id: product.result.id })
      response.status(200).json({ id: plan.result.id })
    } catch (error) {
      response.status(500).json({ error: (error as Error).message })
    }
  } else {
    response.setHeader('Allow', ['POST'])
    response.status(405).end(`Method ${request.method} Not Allowed`)
  }
}
