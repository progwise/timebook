/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { format } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const invoiceUpdateMutation = gql`
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

  await prisma.user.createMany({
    data: [
      { id: 'U1', name: 'ADMIN' },
      { id: 'U2', name: 'MEMBER' },
    ],
  })
  await prisma.organization.create({
    data: {
      id: '01',
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
      organizationId: '01',
      invoiceWorkFrom: new Date().toISOString(),
      invoiceWorkUntil: new Date().toISOString(),
    },
  })
})

const formattedDate = format(new Date(), 'yyyy-MM-dd')

describe('invoiceUpdateMutation', () => {
  it('should throw error when user is unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          organizationId: '01',
        },
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
    expect(response.data).toBeNull()
  })

  it('should throw an error when user is not an admin', async () => {
    const testServer = getTestServer({ userId: 'U2' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          organizationId: 'O1',
          customerName: 'Customer 1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update invoice customer name', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 2',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          organizationId: '01',
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

  it('should send invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const sendDate = format(new Date(), 'yyyy-MM-dd')
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          sendDate,
          organizationId: '01',
        },
        action: 'Send',
      },
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      invoiceUpdate: {
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
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          sendDate: futureDate,
          organizationId: '01',
        },
        action: 'Send',
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Invoice send date must not be in the future')])
    expect(response.data).toBeNull()
  })

  it('should pay invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const payDate = format(new Date(), 'yyyy-MM-dd')
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          payDate,
          organizationId: '01',
        },
        action: 'Pay',
      },
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      invoiceUpdate: {
        id: 'I1',
      },
    })
    const invoice = await prisma.invoice.findUnique({ where: { id: 'I1' } })
    expect(invoice?.invoiceStatus).toBe('PAID')
    expect(invoice?.payDate).toEqual(new Date(payDate))
  })

  it('should throw error when pay date is in the future', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const futureDate = format(new Date(Date.now() + 1000 * 60 * 60 * 24), 'yyyy-MM-dd')
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          payDate: futureDate,
          organizationId: '01',
        },
        action: 'Pay',
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Invoice pay date must not be in the future')])
    expect(response.data).toBeNull()
  })

  it('should reset pay date', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          organizationId: '01',
        },
        action: 'ResetPayDate',
      },
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      invoiceUpdate: {
        id: 'I1',
      },
    })
    const invoice = await prisma.invoice.findUnique({ where: { id: 'I1' } })
    expect(invoice?.payDate).toBeNull()
  })

  it('should withdraw invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        data: {
          customerName: 'Customer 1',
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: formattedDate,
          organizationId: '01',
        },
        action: 'Withdraw',
      },
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      invoiceUpdate: {
        id: 'I1',
      },
    })
    const invoice = await prisma.invoice.findUnique({ where: { id: 'I1' } })
    expect(invoice?.invoiceStatus).toBe('DRAFT')
    expect(invoice?.sendDate).toBeNull()
    expect(invoice?.payDate).toBeNull()
  })
})
