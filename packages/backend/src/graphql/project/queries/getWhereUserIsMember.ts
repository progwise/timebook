import { Prisma } from '@progwise/timebook-prisma'

const generateMembership = (userId: string, isAdmin: boolean): Prisma.ProjectWhereInput => ({
  OR: [
    {
      projectMemberships: {
        some: {
          userId,
          projectRole: isAdmin ? 'ADMIN' : undefined,
        },
      },
    },
    {
      organization: {
        organizationMemberships: {
          some: {
            userId,
            organizationRole: 'ADMIN',
          },
        },
      },
    },
  ],
})

export const getWhereUserIsMember = (userId: string, isAdmin = false): Prisma.ProjectWhereInput =>
  generateMembership(userId, isAdmin)

interface GetWhereUsersAreMembersProps {
  userIds: string[]
  isAdmin?: boolean
}

export const getWhereUsersAreMembers = ({
  userIds,
  isAdmin = false,
}: GetWhereUsersAreMembersProps): Prisma.ProjectWhereInput => ({
  OR: userIds.map((userId) => generateMembership(userId, isAdmin)),
})
