import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamUpdateMutation = `
  mutation teamUpdateMutation($id: ID!, $data: TeamInput!) {
    teamUpdate(id: $id, data: $data) {
      id 
      title
      slug
    }
  }
`

describe('teamUpdateMutationField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Test User 1',
      },
    })
    await prisma.user.create({
      data: {
        id: '2',
        name: 'Test User 2',
      },
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
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: teamUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Progwise',
          slug: 'progwise',
        },
      },
    })
    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when user is not admin', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: teamUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Progwise',
          slug: 'progwise',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update team', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: teamUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'Progwise-Updated',
          slug: 'progwise-updated',
        },
      },
    })

    expect(response.data).toEqual({
      teamUpdate: {
        id: '1',
        title: 'Progwise-Updated',
        slug: 'progwise-updated',
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
