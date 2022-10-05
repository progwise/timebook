import { Context } from './context'

export const isTeamAdmin = async (context: Context): Promise<boolean> => {
  const teamSlug = context.teamSlug
  const userId = context.session?.user.id

  if (!teamSlug || !userId) {
    return false
  }

  const teamMembership = await context.prisma.teamMembership.findFirst({
    where: {
      team: { slug: teamSlug },
      userId,
    },
  })

  return teamMembership?.role === 'ADMIN'
}
