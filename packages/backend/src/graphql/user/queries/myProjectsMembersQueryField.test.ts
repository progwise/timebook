import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const myProjectsMembersQuery = gql`
  query {
    myProjectsMembers {
      id
      name
    }
  }
`

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.project.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'Admin' },
      { id: '2', name: 'Member' },
    ],
  })

  await prisma.project.create({
    data: {
      id: 'P1',
      title: 'Project 1',
      projectMemberships: {
        createMany: {
          data: [
            { userId: '1', projectRole: 'ADMIN' },
            { userId: '2', projectRole: 'MEMBER' },
          ],
        },
      },
    },
  })
})

it('should throw an error when the user is not signed in', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: myProjectsMembersQuery,
  })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should return an empty array when the user is not an admin', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: myProjectsMembersQuery,
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ myProjectsMembers: [] })
})

it('should return all members from projects where the user is an admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: myProjectsMembersQuery,
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    myProjectsMembers: [
      { id: '1', name: 'Admin' },
      { id: '2', name: 'Member' },
    ],
  })
})
