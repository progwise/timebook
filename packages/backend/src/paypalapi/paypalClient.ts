import createClient, { Middleware } from 'openapi-fetch'

import type { components as billingComponents, paths as billingPaths } from './billingSubscriptionsV1'
import type { components as catalogsComponents, paths as catalogsPaths } from './catalogsProductsV1'

export const paypalClient = createClient<billingPaths & catalogsPaths>({ baseUrl: process.env.PAYPAL_URL })

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

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = await getAccessToken()
    request.headers.set('Authorization', `Bearer ${accessToken}`)

    return request
  },
}

paypalClient.use(authMiddleware)

export type components = billingComponents & catalogsComponents
