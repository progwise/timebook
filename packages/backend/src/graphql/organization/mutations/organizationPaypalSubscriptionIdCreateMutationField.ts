import { builder } from '../../builder'

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

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

builder.mutationField('organizationPaypalSubscriptionIdCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).string({
    description: 'Create a PayPal subscription for organization',
    args: {
      organizationId: t.arg.id(),
    },
    resolve: async (_source, { organizationId }) => {
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

      if (!createProductResponse.ok) {
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
          description: 'A monthly Organization Subscription',
          billing_cycles: [
            // {
            //   frequency: {
            //     interval_unit: 'MONTH',
            //     interval_count: 1,
            //   },
            //   tenure_type: 'TRIAL',
            //   sequence: 1,
            //   total_cycles: 1,
            // },
            {
              frequency: {
                interval_unit: 'MONTH',
                interval_count: 1,
              },
              tenure_type: 'REGULAR',
              sequence: 1,
              total_cycles: 0,
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
            setup_fee_failure_action: 'CONTINUE',
            // roughly 1 attempt every 5 days
            payment_failure_threshold: 3,
          },
          // taxes: {
          //   percentage: "10",
          //   inclusive: false
          // }
        }),
      })

      if (!createPlanResponse.ok) {
        throw new Error('Could not create plan')
      }

      const plan = await createPlanResponse.json()

      const createSubscriptionResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          plan_id: plan.id,
          // start_time: new Date(),
          custom_id: organizationId,
          application_context: {
            brand_name: 'Timebook',
            user_action: 'SUBSCRIBE_NOW',
            // return_url: 'https://example.com/return',
            // cancel_url: 'https://example.com/cancel',
          },
        }),
      })

      if (!createSubscriptionResponse.ok) {
        throw new Error('Could not create subscription')
      }

      const subscription = await createSubscriptionResponse.json()

      return subscription.id
    },
  }),
)
