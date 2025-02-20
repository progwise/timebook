import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const invoiceUpdateMutation = gql`
  mutation invoiceUpdate($id: ID!, $data: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, data: $data) {
      id
    }
  }
`

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.invoice.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: 'U1', name: 'Admin' },
      { id: 'U2', name: 'Member' },
    ],
  })
  await prisma.organization.create({
    data: {
      id: 'O1',
      title: 'Organization 1',
      organizationMemberships: { create: { userId: 'U1', organizationRole: 'ADMIN' } },
    },
  })
  await prisma.invoice.create({
    data: {
      id: 'I1',
      organizationId: 'O1',
      createdByUserId: 'U1',
      customerName: 'Customer',
      invoiceWorkFrom: new Date(),
      invoiceWorkUntil: new Date(),
    },
  })
})

describe('Error', () => {
  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })

    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          organizationId: 'O1',
          customerName: 'Customer 2',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw an error when user is not an admin', async () => {
    const testServer = getTestServer({ userId: 'U2' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          organizationId: 'O1',
          customerName: 'Customer 2',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })
})

it('should update invoice', async () => {
  const testServer = getTestServer({ userId: 'U1' })
  const response = await testServer.executeOperation({
    query: invoiceUpdateMutation,
    variables: {
      id: 'I1',
      data: {
        organizationId: 'O1',
        customerName: 'Customer 2',
      },
    },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceUpdate: {
      id: 'I1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: 'I1' } })
  expect(invoice?.customerName).toBe('Customer 2')
})
