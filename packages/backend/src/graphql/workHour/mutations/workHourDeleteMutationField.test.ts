import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourDeleteMutation = gql`
  mutation workHourDeleteMutation($id: ID!) {
    workHourDelete(id: $id) {
      id
    }
  }
`

describe('workHourDeleteMutationField', () => {
  beforeEach(async () => {
    await prisma.workHour.deleteMany()
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User with project membership (role=member)',
        },
        {
          id: '2',
          name: 'Test User without project membership',
        },
        {
          id: '3',
          name: 'Test User with project membership (role=Admin)',
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
            workHours: {
              create: {
                id: '1',
                date: new Date(),
                duration: 120,
                userId: '1',
              },
            },
          },
        },
        projectMemberships: {
          createMany: { data: [{ userId: '1' }, { userId: '3', role: 'ADMIN' }] },
        },
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '1' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it("should throw error when work hour doesn't belong to the user", async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '1' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should delete when work hour belongs to the user', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '1' } })

    expect(response.data).toEqual({ workHourDelete: { id: '1' } })
    expect(response.errors).toBeUndefined()
    expect(await prisma.workHour.count()).toBe(0)
  })

  it('should delete when user is Admin of the project', async () => {
    const testServer = getTestServer({ userId: '3' })
    const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '1' } })

    expect(response.data).toEqual({ workHourDelete: { id: '1' } })
    expect(response.errors).toBeUndefined()
    expect(await prisma.workHour.count()).toBe(0)
  })
})
