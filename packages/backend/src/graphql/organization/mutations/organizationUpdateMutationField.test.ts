import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const organizationUpdateMutation = gql`
  mutation organizationUpdate($id: ID!, $data: OrganizationInput!) {
    organizationUpdate(id: $id, data: $data) {
      id
      title
    }
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
        create: { userId: '1' },
      },
    },
  })
})

it('should throw an error when the user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: organizationUpdateMutation,
    variables: {
      id: 'O1',
      data: {
        title: 'new organization title',
      },
    },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when the user is not an organization member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: organizationUpdateMutation,
    variables: {
      id: 'O1',
      data: {
        title: 'new organization title',
      },
    },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should update an organization', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationUpdateMutation,
    variables: {
      id: 'O1',
      data: {
        title: 'new organization title',
      },
    },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationUpdate: {
      id: 'O1',
      title: 'new organization title',
    },
  })
})
