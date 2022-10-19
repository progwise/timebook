import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const userCapacityUpdateMutation = `
  mutation userCapacityUpdate($userId: ID!, $availableMinutesPerWeek: Int!) {
      userCapacityUpdate(userId: $userId, availableMinutesPerWeek: $availableMinutesPerWeek) {
      id
      availableMinutesPerWeek
    }
  }
`

describe('userCapatityUpdate', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.team.deleteMany()
    await prisma.teamMembership.deleteMany()
  })

  it('should throw an error when the user is not an admin', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'MEMBER', teamId: '1', userId: '1' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise' })

    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '1',
        availableMinutesPerWeek: 1,
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update capacity hours if user is a team admin', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'ADMIN', teamId: '1', userId: '1' } })
    await prisma.user.create({ data: { id: '2' } })
    await prisma.teamMembership.create({ data: { role: 'MEMBER', teamId: '1', userId: '2' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '2',
        availableMinutesPerWeek: 3,
      },
    })

    expect(response.data).toEqual({ userCapacityUpdate: { id: '2', availableMinutesPerWeek: 3 } })
    expect(response.errors).toBeUndefined()
  })

  it('should throw error if user is not team member', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'ADMIN', teamId: '1', userId: '1' } })
    await prisma.user.create({ data: { id: '2' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '2',
        availableMinutesPerWeek: 3,
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('user not found in team')])
  })
})
