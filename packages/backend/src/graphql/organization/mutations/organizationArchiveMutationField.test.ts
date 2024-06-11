import { gql } from 'apollo-server-core'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const organizationArchiveMutation = gql`
  mutation organizationArchive {
    organizationArchive(organizationId: "O1") {
      id
      isArchived
    }
  }
`

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  await prisma.user.create({
    data: { id: '1', name: 'user 1' },
  })

  await prisma.organization.create({
    data: {
      id: 'O1',
      title: 'Organization 1',
      organizationMemberships: {
        create: { userId: '1' },
      },
    },
  })
})

it('should archive organization', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({ query: organizationArchiveMutation })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationArchive: { id: 'O1', isArchived: true },
  })
})
