/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { format } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const InvoiceUpdateMutationDocument = gql`
  mutation invoiceUpdate($id: ID!, $data: InvoiceUpdateInput!, $action: InvoiceAction) {
    invoiceUpdate(id: $id, data: $data, action: $action) {
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

const formattedDate = format(new Date(), 'yyyy-MM-dd')

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        organizationId: '1',
      },
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should send invoice', async () => {
  const testServer = getTestServer({ userId: '1' })
  const sendDate = format(new Date(), 'yyyy-MM-dd')
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        sendDate,
        organizationId: '1',
      },
      action: 'Send',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceUpdate: {
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
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        sendDate: futureDate,
        organizationId: '1',
      },
      action: 'Send',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Invoice send date must not be in the future')])
  expect(response.data).toBeNull()
})

it('should pay invoice', async () => {
  const testServer = getTestServer({ userId: '1' })
  const payDate = format(new Date(), 'yyyy-MM-dd')
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        payDate,
        organizationId: '1',
      },
      action: 'Pay',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceUpdate: {
      id: '1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: '1' } })
  expect(invoice?.invoiceStatus).toBe('PAID')
  expect(invoice?.payDate).toEqual(new Date(payDate))
})

it('should throw error when pay date is in the future', async () => {
  const testServer = getTestServer({ userId: '1' })
  const futureDate = format(new Date(Date.now() + 1000 * 60 * 60 * 24), 'yyyy-MM-dd')
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        payDate: futureDate,
        organizationId: '1',
      },
      action: 'Pay',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Invoice pay date must not be in the future')])
  expect(response.data).toBeNull()
})

it('should reset pay date', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        organizationId: '1',
      },
      action: 'ResetPayDate',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceUpdate: {
      id: '1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: '1' } })
  expect(invoice?.payDate).toBeNull()
})

it('should withdraw invoice', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: InvoiceUpdateMutationDocument,
    variables: {
      id: '1',
      data: {
        customerName: 'Customer 1',
        customerAddress: 'Address 1',
        invoiceDate: formattedDate,
        invoiceWorkFrom: formattedDate,
        invoiceWorkUntil: formattedDate,
        organizationId: '1',
      },
      action: 'Withdraw',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceUpdate: {
      id: '1',
    },
  })
  const invoice = await prisma.invoice.findUnique({ where: { id: '1' } })
  expect(invoice?.invoiceStatus).toBe('DRAFT')
  expect(invoice?.sendDate).toBeNull()
  expect(invoice?.payDate).toBeNull()
})
