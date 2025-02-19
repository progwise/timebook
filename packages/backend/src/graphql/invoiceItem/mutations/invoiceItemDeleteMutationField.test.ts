import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const invoiceItemDeleteMutation = gql`
  mutation invoiceItemDelete($invoiceItemId: ID!, $organizationId: ID!) {
    invoiceItemDelete(invoiceItemId: $invoiceItemId, organizationId: $organizationId) {
      id
    }
  }
`

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.invoiceItem.deleteMany()

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
      organizationMemberships: {
        createMany: {
          data: [
            { userId: 'U1', organizationRole: 'ADMIN' },
            { userId: 'U2', organizationRole: 'MEMBER' },
          ],
        },
      },
      projects: {
        create: {
          id: 'P1',
          title: 'Project 1',
          tasks: {
            create: { id: 'T1', title: 'Task 1' },
          },
        },
      },
      invoices: {
        create: {
          id: 'I1',
          customerName: 'Customer',
          invoiceWorkFrom: new Date(),
          invoiceWorkUntil: new Date(),
          createdByUserId: 'U1',
          invoiceItems: {
            create: {
              id: 'II1',
              taskId: 'T1',
              duration: 60,
              hourlyRate: 100,
            },
          },
        },
      },
    },
  })
})

it('should throw an error when user is unauthenticated', async () => {
  const testServer = getTestServer({ noSession: true })

  const response = await testServer.executeOperation({
    query: invoiceItemDeleteMutation,
    variables: { invoiceItemId: 'I1', organizationId: 'O1' },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when user is not an admin of the organization', async () => {
  const testServer = getTestServer({ userId: 'U2' })

  const response = await testServer.executeOperation({
    query: invoiceItemDeleteMutation,
    variables: { invoiceItemId: 'II1', organizationId: 'O1' },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should delete invoice item when user is an admin of the organization', async () => {
  const testServer = getTestServer({ userId: 'U1' })

  const response = await testServer.executeOperation({
    query: invoiceItemDeleteMutation,
    variables: { invoiceItemId: 'II1', organizationId: 'O1' },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    invoiceItemDelete: { id: 'II1' },
  })

  const invoiceItem = await prisma.invoiceItem.findUnique({ where: { id: 'II1' } })
  expect(invoiceItem).toBeNull()
})
