import createClient from 'openapi-fetch'

import { builder } from '../../builder'
import type { paths as billingPaths, components } from './../../../paypalapi/billingSubscriptionsV1'
import type { paths as catalogsPaths } from './../../../paypalapi/catalogsProductsV1'

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
      returnUrl: t.arg.string(),
      cancelUrl: t.arg.string(),
    },
    resolve: async (_source, { organizationId, returnUrl, cancelUrl }) => {
      const accessToken = await getAccessToken()

      const catalogsClient = createClient<catalogsPaths>({ baseUrl: 'https://api-m.sandbox.paypal.com' })

      const createProductResponse = await catalogsClient.POST('/v1/catalogs/products', {
        body: {
          name: 'Monthly Organization Subscription',
          description: 'Monthly Organization Subscription product',
          type: 'SERVICE',
          category: 'SOFTWARE',
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const product = await createProductResponse.data

      if (!createProductResponse.response.ok || !product?.id) {
        throw new Error('Could not create product')
      }

      const billingClient = createClient<billingPaths>({ baseUrl: 'https://api-m.sandbox.paypal.com' })

      const createPlanResponse = await billingClient.POST('/v1/billing/plans', {
        body: {
          product_id: product.id,
          name: 'Monthly Organization Subscription',
          status: 'ACTIVE',
          description: 'Monthly Organization Subscription basic plan',
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
          quantity_supported: false,
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee_failure_action: 'CONTINUE',
            // roughly 1 attempt every 5 days
            payment_failure_threshold: 3,
          },
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const plan = await createPlanResponse.data

      if (!createPlanResponse.response.ok || !plan?.id) {
        throw new Error('Could not create plan')
      }

      const futureDate = new Date(Date.now() + 5 * 1000)

      const createSubscriptionResponse = await billingClient.POST('/v1/billing/subscriptions', {
        body: {
          plan_id: plan.id,
          start_time: futureDate.toISOString(),
          custom_id: organizationId.toString(),
          application_context: {
            brand_name: 'Timebook',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: 'http://localhost:3000' + returnUrl,
            cancel_url: 'http://localhost:3000' + cancelUrl,
          },
          auto_renewal: true,
        } satisfies components['schemas']['subscription_request_post'],
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const subscription = createSubscriptionResponse.data

      if (!createSubscriptionResponse.response.ok || !subscription?.id) {
        throw new Error('Could not create subscription')
      }

      return subscription.id
    },
  }),
)
