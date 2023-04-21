import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const projectArchiveMutation = gql`
  mutation projectArchive {
    projectArchive(projectId: "P1") {
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

  const response = await testServer.executeOperation({ query: projectArchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when user is project member with role=Member', async () => {
  const testServer = getTestServer({ userId: '2' })

  const response = await testServer.executeOperation({ query: projectArchiveMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should archive project', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectArchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectArchive: { id: 'P1', isArchived: true },
  })
})

it('should keep archivedAt untouched when project is already archived', async () => {
  await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: new Date('2023-01-01') } })
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectArchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectArchive: { id: 'P1', isArchived: true },
  })

  const project = await prisma.project.findUniqueOrThrow({ where: { id: 'P1' } })
  expect(project.archivedAt).toEqual(new Date('2023-01-01'))
})
