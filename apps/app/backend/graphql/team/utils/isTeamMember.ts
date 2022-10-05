import { Prisma } from '.prisma/client'
import { Context } from '../../context'

export const isTeamMember = async (teamWhere: Prisma.TeamWhereUniqueInput, context: Context): Promise<boolean> => {
  if (!context.session?.user) {
    return false
  }

  const team = await context.prisma.team.findFirst({
    where: {
      ...teamWhere,
      teamMemberships: {
        some: { userId: context.session.user.id },
      },
    },
  })

  return !!team
}
