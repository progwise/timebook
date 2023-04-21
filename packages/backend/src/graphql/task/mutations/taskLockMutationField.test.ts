import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { getTestServer } from '../../../getTestServer'
import { prisma } from '../../prisma'

const taskLockMutation = gql`
  mutation taskLock {
    taskLock(taskId: "T1") {
      id
      isLocked
      isLockedByUser
    }
  }
`

beforeEach(async () => {
  await prisma.lockedTask.deleteMany()
  await prisma.user.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'User with project membership' },
      { id: '2', name: 'User without project membership' },
    ],
  })

  await prisma.project.create({
    data: {
      title: 'P1',
      projectMemberships: { create: { userId: '1' } },
      tasks: { create: { id: 'T1', title: 'Task 1' } },
    },
  })
})

it('should throw error when unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: taskLockMutation })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not a project member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({ query: taskLockMutation })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should lock task when user is project member', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: taskLockMutation })
  const lockedTaskCount = await prisma.lockedTask.count()

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ taskLock: { id: 'T1', isLocked: true, isLockedByUser: true } })
  expect(lockedTaskCount).toBe(1)
})

it('should keep lock untouched when task lock already exists', async () => {
  await prisma.lockedTask.create({ data: { taskId: 'T1', userId: '1' } })
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: taskLockMutation })
  const lockedTaskCount = await prisma.lockedTask.count()

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ taskLock: { id: 'T1', isLocked: true, isLockedByUser: true } })
  expect(lockedTaskCount).toBe(1)
})
