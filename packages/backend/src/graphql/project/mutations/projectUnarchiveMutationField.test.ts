import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const projectUnarchiveMutation = gql`
  mutation projectUnarchive {
    projectUnarchive(projectId: "P1") {
      id
      isArchived
    }
  }
`

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.project.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'User with role admin' },
      { id: '2', name: 'User with role member' },
    ],
  })

  await prisma.project.create({
    data: {
      id: 'P1',
      title: 'Project 1',
      archivedAt: new Date(),
      projectMemberships: {
        createMany: {
          data: [
            { userId: '1', role: 'ADMIN' },
            { userId: '2', role: 'MEMBER' },
          ],
        },
      },
    },
  })
})

it('should throw an error when user is unauthenticated', async () => {
  const testServer = getTestServer({ noSession: true })

  const response = await testServer.executeOperation({ query: projectUnarchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when user is project member with role=Member', async () => {
  const testServer = getTestServer({ userId: '2' })

  const response = await testServer.executeOperation({ query: projectUnarchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should unarchive project', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectUnarchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectUnarchive: { id: 'P1', isArchived: false },
  })
})

it('should keep archivedAt untouched when project is already archived', async () => {
  // eslint-disable-next-line unicorn/no-null
  await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: null } })
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectUnarchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectUnarchive: { id: 'P1', isArchived: false },
  })
})
