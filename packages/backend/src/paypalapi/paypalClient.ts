import createClient from 'openapi-fetch'

import type { components as billingComponents, paths as billingPaths } from './billingSubscriptionsV1'
import type { components as catalogsComponents, paths as catalogsPaths } from './catalogsProductsV1'

export const paypalClient = createClient<billingPaths & catalogsPaths>({ baseUrl: 'https://api-m.sandbox.paypal.com' })

export type components = billingComponents & catalogsComponents
