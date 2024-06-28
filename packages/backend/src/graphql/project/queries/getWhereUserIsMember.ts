import { Prisma } from '@progwise/timebook-prisma'

export const getWhereUserIsMember = (userId: string, isAdmin = false): Prisma.ProjectWhereInput => ({
  OR: [
    {
      projectMemberships: {
        some: {
          userId,
          role: isAdmin ? 'ADMIN' : undefined,
        },
      },
    },
    {
      organization: {
        organizationMemberships: {
          some: {
            userId,
          },
        },
      },
    },
  ],
})
