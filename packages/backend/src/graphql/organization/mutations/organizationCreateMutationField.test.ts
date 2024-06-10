import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const organizationCreateMutation = gql`
  mutation organizationCreate($data: OrganizationInput!) {
    organizationCreate(data: $data) {
      id
      title
      address
    }
  }
`
const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  await prisma.user.createMany({
    data: [{ id: '1', name: 'User with role admin' }],
  })
})

it('should throw an error when user is unauthenticated', async () => {
  const testServer = getTestServer({ noSession: true })

  const response = await testServer.executeOperation({
    query: organizationCreateMutation,
    variables: { data: { title: 'org 1', address: 'Teststr' } },
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error without title', async () => {
  const testServer = getTestServer({ userId: '1' })

  //ZOD
  const response = await testServer.executeOperation({
    query: organizationCreateMutation,
    variables: { data: { title: '', address: 'Teststr' } },
  })

  expect(response.data).toBeUndefined()
  // eslint-disable-next-line jest/prefer-to-be
  expect(response.errors?.at(0)?.message).toEqual(
    'Variable "$data" got invalid value null at "data.title"; Expected non-nullable type "String!" not to be null.',
  )
})

it('should create a new organization', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: organizationCreateMutation,
    variables: { data: { title: 'org 1', address: 'Teststr' } },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ organizationCreate: { address: 'Teststr', id: expect.any(String), title: 'org 1' } })
})
