/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { addDays, format, subDays } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const invoiceUpdateMutation = gql`
  mutation invoiceUpdate($id: ID!, $organizationId: ID!, $data: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, organizationId: $organizationId, data: $data) {
      id
    }
  }
`

const formattedDate = format(new Date(), 'yyyy-MM-dd')
const currentDateISO = new Date().toISOString()
const futureDate = format(addDays(new Date(), 1), 'yyyy-MM-dd')

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
      id: '01',
      title: 'Organization 1',
      organizationMemberships: { create: { userId: 'U1', organizationRole: 'ADMIN' } },
    },
  })
  await prisma.invoice.create({
    data: {
      id: 'I1',
      createdByUserId: 'U1',
      customerName: 'Customer 1',
      customerAddress: 'Address 1',
      invoiceStatus: 'DRAFT',
      organizationId: '01',
      invoiceWorkFrom: currentDateISO,
      invoiceWorkUntil: addDays(new Date(currentDateISO), 1).toISOString(),
    },
  })
})

describe('invoiceUpdateMutation', () => {
  it('should throw error when user is unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          customerName: 'Customer 1',
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
        organizationId: 'O1',
        data: {
          customerName: 'Customer 1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when invoice end date is before start date', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          invoiceWorkFrom: formattedDate,
          invoiceWorkUntil: format(subDays(new Date(currentDateISO), 1), 'yyyy-MM-dd'),
        },
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Invoice end date must be after the start date')])
    expect(response.data).toBeNull()
  })

  it('should update invoice customer address', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          customerAddress: 'Address 2',
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
    expect(invoice?.customerAddress).toBe('Address 2')
  })

  it('should update invoice customer name', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
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

  it('should send invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const sendDate = formattedDate
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          customerName: 'Customer 1',
          sendDate,
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
    expect(invoice?.invoiceStatus).toBe('SENT')
    expect(invoice?.sendDate).toEqual(new Date(sendDate))
  })

  it('should throw error when send date is in the future', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          sendDate: futureDate,
        },
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Invoice send date must not be in the future')])
    expect(response.data).toBeNull()
  })

  it('should withdraw invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          sendDate: null,
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
    expect(invoice?.invoiceStatus).toBe('DRAFT')
    expect(invoice?.sendDate).toBeNull()
  })

  it('should pay invoice', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const payDate = formattedDate
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          payDate,
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
    expect(invoice?.invoiceStatus).toBe('PAID')
    expect(invoice?.payDate).toEqual(new Date(payDate))
  })

  it('should throw error when pay date is in the future', async () => {
    const testServer = getTestServer({ userId: 'U1' })
    const response = await testServer.executeOperation({
      query: invoiceUpdateMutation,
      variables: {
        id: 'I1',
        organizationId: '01',
        data: {
          payDate: futureDate,
        },
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
        organizationId: '01',
        data: {
          payDate: null,
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
    expect(invoice?.payDate).toBeNull()
  })
})
