/**
 * @vitest-environment prisma-postgres
 */

import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const teamCreateMutation = `
  mutation teamCreateMutation($data: TeamInput!) {
    teamCreate(data: $data) {
      title
      slug
      theme
    }
  }
`

describe('teamCreateMutationField', () => {
  let prisma: PrismaClient
  beforeAll(() => {
    prisma = new PrismaClient()
  })

  beforeEach(async () => {
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
        },
      ],
    })
  })

  it('should throw error when user is unauthorized', async () => {
    const testServer = getTestServer({ prisma, noSession: true })
    const response = await testServer.executeOperation({
      query: teamCreateMutation,
      variables: {
        data: {
          title: 'Google',
          slug: 'google',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when team slug already exists', async () => {
    await prisma.team.create({
      data: {
        title: 'Google',
        slug: 'google',
      },
    })

    const testServer = getTestServer({ prisma })
    const response = await testServer.executeOperation({
      query: teamCreateMutation,
      variables: {
        data: {
          title: 'Google',
          slug: 'google',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Team slug already taken')])
  })

  it('should throw error when user already has 10 teams', async () => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    for (let i = 0; i < 10; i++) {
      await prisma.team.create({
        data: {
          title: `Team ${i}`,
          slug: `team${i}`,
          teamMemberships: { create: { userId: '1' } },
        },
      })
    }

    const testServer = getTestServer({ prisma })
    const response = await testServer.executeOperation({
      query: teamCreateMutation,
      variables: {
        data: {
          title: 'Google',
          slug: 'google',
        },
      },
    })

    expect(await prisma.team.count()).toBe(10)
    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Too many teams')])
  })

  it('should create a team and become admin of the team', async () => {
    const testServer = getTestServer({ prisma, userId: '1' })
    const response = await testServer.executeOperation({
      query: teamCreateMutation,
      variables: {
        data: {
          title: 'Google',
          slug: 'google',
        },
      },
    })

    expect(response.data).toEqual({
      teamCreate: {
        slug: 'google',
        theme: 'BLUE',
        title: 'Google',
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
