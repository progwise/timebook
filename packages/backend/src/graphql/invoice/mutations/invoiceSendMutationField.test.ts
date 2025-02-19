/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { format } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const invoiceSendMutation = gql`
  mutation invoiceSend($data: InvoiceSendInput!) {
    invoiceSend(data: $data) {
      id
    }
  }
`

beforeEach(async () => {
  await prisma.invoice.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

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
      createdByUserId: 'U1',
      invoiceDate: new Date().toISOString(),
      customerName: 'Customer 1',
      customerAddress: 'Address 1',
      invoiceStatus: 'DRAFT',
      organizationId: 'O1',
      invoiceWorkFrom: new Date().toISOString(),
      invoiceWorkUntil: new Date().toISOString(),
      sendDate: null,
    },
  })
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: invoiceSendMutation,
    variables: {
      data: {
        invoiceId: 'I1',
        sendDate: '2024-01-01',
        organizationId: 'O1',
      },
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw an error when user is not an admin', async () => {
  const testServer = getTestServer({ userId: 'U2' })
  const response = await testServer.executeOperation({
    query: invoiceSendMutation,
    variables: {
      id: 'I1',
      data: {
        invoiceId: 'I1',
        sendDate: '2024-01-01',
        organizationId: 'O1',
      },
    },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should send invoice', async () => {
  const testServer = getTestServer({ userId: 'U1' })
  const sendDate = '2024-01-01'
  const response = await testServer.executeOperation({
    query: invoiceSendMutation,
    variables: {
      data: {
        invoiceId: 'I1',
        sendDate,
        organizationId: 'O1',
      },
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceSend: {
      id: 'I1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: 'I1' } })
  expect(invoice?.invoiceStatus).toBe('SENT')
  expect(invoice?.sendDate).toEqual(new Date(sendDate))
})

it('should throw error when send date is in the future', async () => {
  const testServer = getTestServer({ userId: 'U1' })
  const futureDate = format(new Date(Date.now() + 1000 * 60 * 60 * 24), 'yyyy-MM-dd')
  const response = await testServer.executeOperation({
    query: invoiceSendMutation,
    variables: {
      data: {
        invoiceId: 'I1',
        sendDate: futureDate,
        organizationId: 'O1',
      },
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Invoice send date must not be in the future')])
  expect(response.data).toBeNull()
})
