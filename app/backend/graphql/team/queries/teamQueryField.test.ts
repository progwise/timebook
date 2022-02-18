import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamQuery = `
  query team {
    team {
      id
      title
      members {
        id
        name
      }
    }
  }
`

describe('teamQueryField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Test User',
        teamMemberships: {
          create: {
            team: {
              create: {
                id: '1',
                slug: 'progwise',
                title: 'Progwise',
              },
            },
          },
        },
      },
    })
    await prisma.team.create({
      data: { title: 'Team without members', slug: 'emptyTeam' },
    })
  })

  it('should return error when no teamSlug provided', async () => {
    const testServer = getTestServer({ prisma, teamSlug: undefined })
    const response = await testServer.executeOperation({ query: teamQuery })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return error when teamSlug does not exists', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'unknownSlug' })
    const response = await testServer.executeOperation({ query: teamQuery })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return error when user is not team member', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'emptyTeam' })
    const response = await testServer.executeOperation({ query: teamQuery })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return team when user is member of', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise' })
    const response = await testServer.executeOperation({ query: teamQuery })

    expect(response.data).toEqual({
      team: {
        id: '1',
        title: 'Progwise',
        members: [{ id: '1', name: 'Test User' }],
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
