import { Middleware } from 'openapi-fetch'

import { components, paypalClient } from '../../../paypalapi/paypalClient'
import { builder } from '../../builder'

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const oauthTokenUrl = process.env.PAYPAL_URL + '/v1/oauth2/token'

  const response = await fetch(oauthTokenUrl, {
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
    authScopes: (_sources, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (_source, { organizationId, returnUrl, cancelUrl }) => {
      const accessToken = await getAccessToken()

      const authMiddleware: Middleware = {
        async onRequest({ request }) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
          return request
        },
      }

      paypalClient.use(authMiddleware)

      const createProductResponse = await paypalClient.POST('/v1/catalogs/products', {
        body: {
          name: 'Monthly Organization Subscription',
          description: 'Monthly Organization Subscription product',
          type: 'SERVICE',
          category: 'SOFTWARE',
        },
      })

      const product = await createProductResponse.data

      if (!createProductResponse.response.ok || !product?.id) {
        throw new Error('Could not create product')
      }

      const createPlanResponse = await paypalClient.POST('/v1/billing/plans', {
        body: {
          product_id: product.id,
          name: 'Monthly Organization Subscription',
          status: 'ACTIVE',
          description: 'Monthly Organization Subscription basic plan',
          billing_cycles: [
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
                  currency_code: 'EUR',
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
      })

      const plan = await createPlanResponse.data

      if (!createPlanResponse.response.ok || !plan?.id) {
        throw new Error('Could not create plan')
      }

      const futureDate = new Date(Date.now() + 5 * 1000)

      const createSubscriptionResponse = await paypalClient.POST('/v1/billing/subscriptions', {
        body: {
          plan_id: plan.id,
          start_time: futureDate.toISOString(),
          custom_id: organizationId.toString(),
          application_context: {
            brand_name: 'Timebook',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: process.env.NEXTAUTH_URL + returnUrl,
            cancel_url: process.env.NEXTAUTH_URL + cancelUrl,
          },
          auto_renewal: true,
        } satisfies components['schemas']['subscription_request_post'],
      })

      const subscription = createSubscriptionResponse.data

      if (!createSubscriptionResponse.response.ok || !subscription?.id) {
        throw new Error('Could not create subscription')
      }

      return subscription.id
    },
  }),
)
