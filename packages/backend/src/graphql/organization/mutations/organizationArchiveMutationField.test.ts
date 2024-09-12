import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const organizationArchiveMutation = gql`
  mutation organizationArchive {
    organizationArchive(organizationId: "O1") {
      id
      isArchived
    }
  }
`

const prisma = new PrismaClient()

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
        create: { userId: '1', role: 'ADMIN' },
      },
    },
  })
})

it('should throw an error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: organizationArchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when user is not an organization member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({ query: organizationArchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should archive an organization', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: organizationArchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationArchive: { id: 'O1', isArchived: true },
  })
})
