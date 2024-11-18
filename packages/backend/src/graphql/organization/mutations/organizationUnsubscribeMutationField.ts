import { paypalClient } from '../../../paypalapi/paypalClient'
import { builder } from '../../builder'
import { prisma } from '../../prisma'

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

builder.mutationField('organizationPaypalSubscriptionCancel', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Cancel a PayPal subscription for organization',
    args: {
      organizationId: t.arg.id(),
    },
    authScopes: (_sources, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (_query, _source, { organizationId }) => {
      const accessToken = await getAccessToken()

      const organization = await prisma.organization.findUnique({
        where: { id: organizationId.toString() },
      })

      if (!organization?.paypalSubscriptionId) {
        throw new Error('Organization does not have a PayPal subscription')
      }

      const cancelSubscriptionResponse = await paypalClient.POST('/v1/billing/subscriptions/{id}/cancel', {
        params: {
          path: {
            id: organization.paypalSubscriptionId,
          },
        },
        body: {
          reason: 'Customer requested cancellation',
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!cancelSubscriptionResponse.response.ok) {
        throw new Error('Could not cancel subscription')
      }

      return await prisma.organization.update({
        where: { id: organizationId.toString() },
        data: {
          subscriptionStatus: 'CANCELLED',
        },
      })
    },
  }),
)
