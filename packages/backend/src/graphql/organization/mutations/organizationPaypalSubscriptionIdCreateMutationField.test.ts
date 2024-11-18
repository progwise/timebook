import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

jest.mock('../../../paypalapi/paypalClient', () => ({
  paypalClient: {
    POST: jest.fn((url) => {
      const response = { ok: true }
      if (url === '/v1/catalogs/products') {
        return { response, data: { id: 'product1' } }
      }
      if (url === '/v1/billing/plans') {
        return { response, data: { id: 'plan1' } }
      }
      if (url === '/v1/billing/subscriptions') {
        return { response, data: { id: 'subscription1' } }
      }
    }),
  },
}))

const prisma = new PrismaClient()

const OrganizationPaypalSubscriptionIdCreateMutation = gql`
  mutation OrganizationPaypalSubscriptionIdCreate {
    organizationPaypalSubscriptionIdCreate(
      organizationId: "O1"
      returnUrl: "http://example.com/returnUrl"
      cancelUrl: "http://example.com/cancelUrl"
    )
  }
`

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'user with an organization membership' },
      { id: '2', name: 'user without an organization membership' },
    ],
  })

  await prisma.organization.create({
    data: {
      id: 'O1',
      title: 'Organization 1',
      organizationMemberships: {
        create: { userId: '1', organizationRole: 'ADMIN' },
      },
    },
  })
})

it('should throw an error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: OrganizationPaypalSubscriptionIdCreateMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when user is not an organization member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({ query: OrganizationPaypalSubscriptionIdCreateMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should create a PayPal subscription', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: OrganizationPaypalSubscriptionIdCreateMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationPaypalSubscriptionIdCreate: 'subscription1',
  })
})
