/* eslint-disable unicorn/filename-case */

/* eslint-disable unicorn/no-null */
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

        // change final_payment_time to next_billing_time
        const nextBillingTime = event.resource.billing_info.final_payment_time

        await prisma.organization.update({
          where: { id: activatedSubscriptionOrganizationId },
          data: {
            subscriptionExpiresAt: nextBillingTime,
            paypalSubscriptionId: event.resource.id,
          },
        })
        console.log('Subscription activated:', event.resource.id)
        break
      // case 'PAYMENT.SALE.COMPLETED':
      //   console.log('Payment completed:', event.resource.id)
      //   break
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        const cancelledSubscriptionOrganizationId = event.resource.custom_id

        await prisma.organization.update({
          where: { id: cancelledSubscriptionOrganizationId },
          data: {
            subscriptionExpiresAt: null,
            // paypalSubscriptionId: null
          },
        })
        console.log('Subscription cancelled:', event.resource.id)
        break
    }
  } catch (error) {
    console.error('Webhook error:', error)
    response.status(400).json({ error: 'Webhook handler failed' })
  }
}
