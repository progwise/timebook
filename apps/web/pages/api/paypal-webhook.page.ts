/* eslint-disable unicorn/filename-case */
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST'])
    return response.status(405).end(`Method ${request.method} Not Allowed`)
  }

  const event = request.body

  //todo: add more webhook events

  if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
    console.log('Payment completed:', event.resource.id)
  }

  try {
    response.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    response.status(400).json({ error: 'Webhook handler failed' })
  }
}
