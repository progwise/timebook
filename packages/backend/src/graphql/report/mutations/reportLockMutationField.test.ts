import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const reportLockMutation = gql`
  mutation reportLock {
    reportLock(year: 2023, month: 0, projectId: "P1", userId: "1") {
      isLocked
    }
  }
`

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.report.deleteMany()
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

  const response = await testServer.executeOperation({ query: reportLockMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an when user is project member with role=Member', async () => {
  const testServer = getTestServer({ userId: '2' })

  const response = await testServer.executeOperation({ query: reportLockMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should create a new report', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: reportLockMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    reportLock: { isLocked: true },
  })

  const allReports = await prisma.report.findMany()
  expect(allReports).toEqual([
    {
      projectId: 'P1',
      userId: '1',
      year: 2023,
      month: 0,
    },
  ])
})

it('should work when a report already exists', async () => {
  await prisma.report.create({ data: { projectId: 'P1', userId: '1', year: 2023, month: 0 } })
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: reportLockMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    reportLock: { isLocked: true },
  })

  const allReportsCount = await prisma.report.count()
  expect(allReportsCount).toBe(1)
})
