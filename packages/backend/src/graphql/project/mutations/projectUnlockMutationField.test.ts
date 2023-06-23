import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const projectUnlockMutation = gql`
  mutation projectUnlock {
    projectUnlock(date: { year: 2023, month: 0 }, projectId: "P1") {
      isLocked(date: { year: 2023, month: 0 })
    }
  }
`

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.lockedMonth.deleteMany()
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

  const response = await testServer.executeOperation({ query: projectUnlockMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an when user is project member with role=Member', async () => {
  const testServer = getTestServer({ userId: '2' })

  const response = await testServer.executeOperation({ query: projectUnlockMutation })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should delete a locked month', async () => {
  await prisma.lockedMonth.create({ data: { projectId: 'P1', year: 2023, month: 0 } })
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectUnlockMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectUnlock: { isLocked: false },
  })

  const allLockedMonths = await prisma.lockedMonth.findMany()
  expect(allLockedMonths).toEqual([])
})

it('should work when no locked month exist', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: projectUnlockMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectUnlock: { isLocked: false },
  })

  const allLockedMonths = await prisma.lockedMonth.findMany()
  expect(allLockedMonths).toEqual([])
})
