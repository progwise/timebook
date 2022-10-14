import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamUnarchiveMutation = `
  mutation teamUnarchiveMutation($id: ID!) {
    teamUnarchive(teamId: $id) {
      id
      title
      archived
    }
  }
`

describe('teamUnarchiveMutationField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Admin',
      },
    })
    await prisma.user.create({
      data: {
        id: '2',
        name: 'Member',
      },
    })

    await prisma.user.create({
      data: {
        id: '3',
        name: 'Admin of another team',
      },
    })

    await prisma.team.create({
      data: {
        id: 'Team 1',
        slug: 'progwise',
        title: 'Progwise',
        archivedAt: new Date('2022-01-01'),
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

    await prisma.team.create({
      data: {
        id: 'Team 2',
        slug: 'google',
        title: 'Google',
        archivedAt: new Date('2022-01-01'),
        teamMemberships: {
          create: {
            id: '3',
            userId: '3',
            role: 'ADMIN',
          },
        },
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: teamUnarchiveMutation,
      variables: { id: 'Team 1' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when user is not admin', async () => {
    const testServer = getTestServer({ userId: '2', teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: teamUnarchiveMutation,
      variables: { id: 'Team 1' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when admin is from another team', async () => {
    const testServer = getTestServer({ userId: '1', teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: teamUnarchiveMutation,
      variables: { id: 'Team 2' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should restore team', async () => {
    const testServer = getTestServer({ userId: '1', teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: teamUnarchiveMutation,
      variables: { id: 'Team 1' },
    })

    expect(response.data).toEqual({
      teamUnarchive: {
        id: 'Team 1',
        title: 'Progwise',
        archived: false,
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
