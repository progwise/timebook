import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectUpdateMutation = gql`
  mutation projectUpdateMutation($id: ID!, $data: ProjectInput!) {
    projectUpdate(id: $id, data: $data) {
      id
      title
    }
  }
`

beforeEach(async () => {
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
        name: 'Test User without project memberships',
      },
    ],
  })

  await prisma.project.create({
    data: {
      id: '1',
      title: 'Test Project',
      projectMemberships: {
        create: { userId: '1' },
      },
    },
  })
})

describe('Error', () => {
  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
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
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when user is not a project member', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'new project title',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })
})

describe('Success', () => {
  it('should update a project when user is project member', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: projectUpdateMutation,
      variables: {
        id: '1',
        data: {
          title: 'New Project Title',
        },
      },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projectUpdate: {
        id: '1',
        title: 'New Project Title',
      },
    })
  })
})
