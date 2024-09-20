import { Prisma } from '@progwise/timebook-prisma'

export const getWhereUserIsMember = (userId: string, isAdmin = false): Prisma.ProjectWhereInput => ({
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
