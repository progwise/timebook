/* eslint-disable unicorn/filename-case */
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@progwise/timebook-backend'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST'])
    return response.status(405).end(`Method ${request.method} Not Allowed`)
  }

  const event = request.body

  switch (event.event_type) {
    // case 'BILLING.PLAN.CREATED':
    //   console.log('Plan created:', event.resource.id)
    //   break
    // case 'BILLING.SUBSCRIPTION.CREATED':
    //   console.log('Subscription created:', event.resource.id)
    //   break
    // case 'CATALOG.PRODUCT.CREATED':
    //   console.log('Product created:', event.resource.id)
    //   break
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      const organizationId = event.resource.custom_id
      // change final_payment_time to next_billing_time
      const nextBillingTime = event.resource.billing_info.final_payment_time

      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          subscriptionExpiresAt: nextBillingTime,
          paypalPlanId: event.resource.plan_id,
        },
      })
      console.log(
        'Subscription activated:',
        event.resource.id,
        // 'Next billing time:',
        // nextBillingTime,
        // 'Organization ID:',
        // organizationId,
      )
      break
    // case 'PAYMENT.SALE.COMPLETED':
    //   console.log('Payment completed:', event.resource.id)
    //   break
  }

  try {
    response.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    response.status(400).json({ error: 'Webhook handler failed' })
  }
}
