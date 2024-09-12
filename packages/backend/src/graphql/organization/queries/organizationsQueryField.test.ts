/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const organizationsQuery = gql`
  query organizations {
    organizations {
      id
      title
      address
      canModify
    }
  }
`

beforeEach(async () => {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'user with org membership' },
      { id: '2', name: 'user without org membership' },
    ],
  })

  await prisma.organization.createMany({
    data: [
      { id: '100', title: 'org 1', address: 'Teststr. 123' },
      { id: '101', title: 'org 2' },
    ],
  })

  await prisma.organizationMembership.create({
    data: {
      organizationId: '100',
      userId: '1',
    },
  })
})

it('should throw an error if the user is not signed in', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: organizationsQuery })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should return an organization of the user', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: organizationsQuery })
  expect(response.data?.organizations).toEqual([
    { id: '100', title: 'org 1', address: 'Teststr. 123', canModify: false },
  ])
})

it('should receive no organizations, if the user has no organizations', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({ query: organizationsQuery })
  expect(response.data?.organizations).toEqual([])
})
