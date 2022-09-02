import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectUpdateMutation = `
  mutation projectUpdateMutation($id: ID!, $data: ProjectInput!) {
    projectUpdate(id: $id, data: $data) {
      id
      title
      customer {
        id
        title
      }
    }
  }
`

describe('Error', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()
    await prisma.team.deleteMany()
    await prisma.customer.deleteMany()

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
        {
          id: '3',
          name: 'Test User 3',
        },
      ],
    })

    //Creating Team 1
    await prisma.team.create({
      data: {
        id: '1',
        slug: 'progwise',
        title: 'Progwise',
        customers: {
          createMany: {
            data: [
              { id: '1', title: 'Test Customer 1' },
              { id: '2', title: 'Test Customer 2' },
            ],
          },
        },
        teamMemberships: {
          createMany: {
            data: [
              {
                id: '1',
                userId: '1',
                role: 'ADMIN',
              },
              {
                id: '2',
                userId: '2',
                role: 'MEMBER',
              },
            ],
          },
        },
        projects: {
          create: {
            id: '1',
            title: 'Test Project',
            projectMemberships: {
              createMany: { data: [{ userId: '1' }, { userId: '2' }] },
            },
            customerId: '1',
          },
        },
      },
    })

    //Creating Team 2
    await prisma.team.create({
      data: {
        id: '2',
        slug: 'apple',
        title: 'Apple',
        customers: { create: { id: '3', title: 'Test Customer 3' } },
        teamMemberships: {
          create: {
            id: '3',
            userId: '3',
            role: 'ADMIN',
          },
        },
        projects: {
          create: {
            id: '2',
            title: 'Test Project 2',
            customerId: '3',
          },
        },
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ prisma, noSession: true })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Test Project 1',
          customerId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when user is not a team member', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'apple', userId: '1' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Test Project',
          customerId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when a member tries to update a project', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '2' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Test Project',
          customerId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when the project is from a different team', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'apple', userId: '3' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Test Project 1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('not authenticated')])
  })

  it('should throw error when customer does not exist', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Test Project',
          customerId: 'DoesNotExist',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Customer not found')])
  })

  it('should throw error when customer is from a different team', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'apple', userId: '1' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '2',
        data: {
          title: 'Test Project 2',
          customerId: '3',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  describe('Success', () => {
    it('should update any project when user is admin of the same team', async () => {
      const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
      const response = await testServer.executeOperation({
        query: projectUpdateMutation,
        variables: {
          id: '1',
          data: {
            title: 'Updated Test Project',
          },
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toEqual({
        projectUpdate: {
          id: '1',
          title: 'Updated Test Project',
          // eslint-disable-next-line unicorn/no-null
          customer: null,
        },
      })
    })

    it('should be possible to remove a customer from a project', async () => {
      const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
      const response = await testServer.executeOperation({
        query: projectUpdateMutation,
        variables: {
          id: '1',
          data: {
            title: 'Test Project',
          },
        },
      })

      expect(response.data).toEqual({
        projectUpdate: {
          id: '1',
          title: 'Test Project',
          // eslint-disable-next-line unicorn/no-null
          customer: null,
        },
      })
      expect(response.errors).toBeUndefined()
    })

    it('should be possible to change a customer', async () => {
      const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
      const response = await testServer.executeOperation({
        query: projectUpdateMutation,
        variables: {
          id: '1',
          data: {
            title: 'Test Project',
            customerId: '2',
          },
        },
      })

      expect(response.data).toEqual({
        projectUpdate: {
          id: '1',
          title: 'Test Project',
          customer: { id: '2', title: 'Test Customer 2' },
        },
      })
      expect(response.errors).toBeUndefined()
    })
  })
})
