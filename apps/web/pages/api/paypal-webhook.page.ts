/* eslint-disable unicorn/filename-case */
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@progwise/timebook-backend'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST'])
    return response.status(405).end(`Method ${request.method} Not Allowed`)
  }

  const event = request.body

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        const activatedSubscriptionOrganizationId = event.resource.custom_id

        // next_billing_time not working if setup fee is present
        const nextBillingTime = event.resource.billing_info.next_billing_time

        await prisma.organization.update({
          where: { id: activatedSubscriptionOrganizationId },
          data: {
            subscriptionExpiresAt: nextBillingTime,
            paypalSubscriptionId: event.resource.id,
            subscriptionStatus: 'ACTIVE',
          },
        })
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        const cancelledSubscriptionOrganizationId = event.resource.custom_id

        await prisma.organization.update({
          where: { id: cancelledSubscriptionOrganizationId },
          data: {
            subscriptionStatus: 'CANCELLED',
          },
        })
        break
    }
  } catch {
    response.status(400).json({ error: 'Webhook handler failed' })
  }
  response.json({})
}
