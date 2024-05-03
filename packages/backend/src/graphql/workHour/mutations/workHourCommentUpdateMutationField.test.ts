import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourCommentUpdateMutation = gql`
  mutation workHourCommentUpdateMutation($taskId: ID!, $date: Date!, $comment: String!) {
    workHourCommentUpdate(taskId: $taskId, date: $date, comment: $comment) {
      task {
        id
      }
      date
      comment
      duration
    }
  }
`

describe('workHourCommentUpdateMutationField', () => {
  beforeEach(async () => {
    await prisma.lockedMonth.deleteMany()
    await prisma.workHour.deleteMany()
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User with project membership',
        },
        {
          id: '2',
          name: 'Test User without project membership',
        },
      ],
    })

    await prisma.project.create({
      data: {
        id: 'P1',
        title: 'Project 1',
        tasks: {
          create: {
            id: 'T1',
            title: 'Task 1',
          },
        },
        projectMemberships: { create: { userId: '1' } },
      },
    })
  })

  it('should throw an error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-01-01',
        comment: 'Comment 1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update own comment', async () => {
    await prisma.workHour.create({
      data: {
        taskId: 'T1',
        date: new Date('2022-01-01'),
        duration: 120,
        userId: '1',
      },
    })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        comment: 'Comment 2',
        date: '2022-01-01',
      },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      workHourCommentUpdate: {
        task: {
          id: 'T1',
        },
        date: '2022-01-01',
        comment: 'Comment 2',
        duration: 120,
      },
    })
  })

  it('should throw an error when the user has no project membership', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-01-01',
        comment: 'Comment 2',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw an error when attempting to update a comment on a locked month', async () => {
    await prisma.lockedMonth.create({ data: { year: 2022, month: 0, projectId: 'P1' } })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-01-01',
        comment: 'Comment 2',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('project is locked for the given month')])
  })

  it('should throw an error when the task is locked', async () => {
    await prisma.task.update({ where: { id: 'T1' }, data: { isLocked: true } })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-01-01',
        comment: 'Comment 2',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('task is locked')])
  })

  it('should throw an error when the project is archived', async () => {
    await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: new Date() } })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-01-01',
        comment: 'Comment 2',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('project is archived')])
  })

  it('should create a new comment if it does not exist', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourCommentUpdateMutation,
      variables: {
        taskId: 'T1',
        date: '2022-07-03',
        comment: 'Comment 2',
      },
    })

    expect(response.data).toEqual({
      workHourCommentUpdate: {
        task: {
          id: 'T1',
        },
        date: '2022-07-03',
        comment: 'Comment 2',
        duration: 0,
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
