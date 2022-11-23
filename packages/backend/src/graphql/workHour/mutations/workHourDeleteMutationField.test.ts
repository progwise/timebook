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
    await prisma.team.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User 1',
        },
        {
          id: '2',
          name: 'Test User 2',
        },
      ],
    })

    await prisma.team.create({
      data: {
        id: '1',
        slug: 'progwise',
        title: 'Progwise',
        teamMemberships: {
          createMany: {
            data: [
              {
                userId: '1',
                role: 'ADMIN',
              },
              {
                userId: '2',
                role: 'MEMBER',
              },
            ],
          },
        },
        projects: {
          create: {
            title: 'Project',
            tasks: {
              create: {
                title: 'Task',
                workHours: {
                  createMany: {
                    data: [
                      { id: '1', date: new Date(), duration: 120, userId: '1' },
                      { id: '2', date: new Date(), duration: 120, userId: '2' },
                    ],
                  },
                },
              },
            },
          },
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

  describe("user's role is admin", () => {
    it('should delete when user is team admin', async () => {
      const testServer = getTestServer()
      const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '2' } })

      expect(response.data).toEqual({ workHourDelete: { id: '2' } })
      expect(response.errors).toBeUndefined()
      expect(await prisma.workHour.count()).toBe(1)
    })
  })

  describe("user's role is member", () => {
    it("should throw error when work hour doesn't belong to the user", async () => {
      const testServer = getTestServer({ userId: '2' })
      const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '1' } })

      expect(response.data).toBeNull()
      expect(response.errors).toEqual([new GraphQLError('Not authorized')])
    })

    it('should delete when work hour belongs to the user', async () => {
      const testServer = getTestServer({ userId: '2' })
      const response = await testServer.executeOperation({ query: workHourDeleteMutation, variables: { id: '2' } })

      expect(response.data).toEqual({ workHourDelete: { id: '2' } })
      expect(response.errors).toBeUndefined()
      expect(await prisma.workHour.count()).toBe(1)
    })
  })
})
