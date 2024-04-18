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
          createMany: {
            data: [
              {
                id: 'T1',
                title: 'Task 1',
              },
              {
                id: 'T3',
                title: 'Task 3',
              },
            ],
          },
        },
        projectMemberships: { create: { userId: '1' } },
      },
    })
    await prisma.project.create({
      data: {
        id: 'P2',
        title: 'Project without members',
        tasks: {
          create: {
            id: 'T2',
            title: 'Task 2',
          },
        },
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
        comment: 'comment 1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })
})
