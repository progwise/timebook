/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { format } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const SendInvoiceMutationDocument = gql`
  mutation sendInvoice($data: InvoiceSendInput!) {
    sendInvoice(data: $data) {
      id
    }
  }
`

beforeEach(async () => {
  await prisma.invoice.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({ data: { id: '1', name: 'User 1' } })
  await prisma.organization.create({
    data: {
      id: '1',
      title: 'Organization 1',
      organizationMemberships: { create: { userId: '1', organizationRole: 'ADMIN' } },
    },
  })
  await prisma.invoice.create({
    data: {
      id: '1',
      createdByUserId: '1',
      invoiceDate: new Date().toISOString(),
      customerName: 'Customer 1',
      customerAddress: 'Address 1',
      invoiceStatus: 'DRAFT',
      organizationId: '1',
      invoiceWorkFrom: new Date().toISOString(),
      invoiceWorkUntil: new Date().toISOString(),
      sendDate: null,
    },
  })
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: SendInvoiceMutationDocument,
    variables: {
      data: {
        invoiceId: '1',
        sendDate: '2024-01-01',
        organizationId: '1',
      },
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should send invoice', async () => {
  const testServer = getTestServer({ userId: '1' })
  const sendDate = '2024-01-01'
  const response = await testServer.executeOperation({
    query: SendInvoiceMutationDocument,
    variables: {
      data: {
        invoiceId: '1',
        sendDate,
        organizationId: '1',
      },
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    sendInvoice: {
      id: '1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: '1' } })
  expect(invoice?.invoiceStatus).toBe('SENT')
  expect(invoice?.sendDate).toEqual(new Date(sendDate))
})

it('should throw error when send date is in the future', async () => {
  const testServer = getTestServer({ userId: '1' })
  const futureDate = format(new Date(Date.now() + 1000 * 60 * 60 * 24), 'yyyy-MM-dd')
  const response = await testServer.executeOperation({
    query: SendInvoiceMutationDocument,
    variables: {
      data: {
        invoiceId: '1',
        sendDate: futureDate,
        organizationId: '1',
      },
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Invoice send date must not be in the future')])
  expect(response.data).toBeNull()
})
