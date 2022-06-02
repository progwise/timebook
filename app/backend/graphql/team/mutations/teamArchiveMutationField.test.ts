import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamArchiveMutation = `
  mutation teamArchiveMutation($teamId: ID!) {
    teamArchive(teamId: $teamId) {
      id
      title
      archived
    }
  }
`

describe('teamArchiveMutationField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: 'Can Archive',
        name: 'Admin User',
      },
    })
    await prisma.user.create({
      data: {
        id: 'Can not Archive',
        name: 'Member User',
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
                userId: 'Can Archive',
                role: 'ADMIN',
              },
              {
                id: '2',
                userId: 'Can not Archive',
                role: 'MEMBER',
              },
            ],
          },
        },
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ prisma, noSession: true })
    const response = await testServer.executeOperation({ query: teamArchiveMutation, variables: { teamId: '1' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when user is not admin', async () => {
    const testServer = getTestServer({ prisma, userId: 'Can not Archive', teamSlug: 'progwise' })
    const response = await testServer.executeOperation({ query: teamArchiveMutation, variables: { teamId: '1' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should archive team', async () => {
    const testServer = getTestServer({ prisma, userId: 'Can Archive', teamSlug: 'progwise' })
    const response = await testServer.executeOperation({ query: teamArchiveMutation, variables: { teamId: '1' } })

    expect(response.data).toEqual({
      teamArchive: {
        id: '1',
        title: 'Progwise',
        archived: true,
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
