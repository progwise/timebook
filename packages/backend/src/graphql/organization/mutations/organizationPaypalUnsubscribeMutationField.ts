import { paypalClient } from '../../../paypalapi/paypalClient'
import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('organizationPaypalUnsubscribe', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Cancel a PayPal subscription for organization',
    args: {
      organizationId: t.arg.id(),
    },
    authScopes: (_sources, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (_query, _source, { organizationId }) => {
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
