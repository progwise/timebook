import { Context } from './context'

export const isAdminByProjectId = async (projectId: number, context: Context): Promise<boolean> => {
  if (!context.session?.user.id) {
    return false
  }

  const membership = await context.prisma.projectMembership.findUnique({
    select: { role: true },
    where: {
      userId_projectId: {
        projectId: projectId,
        userId: context.session.user.id,
      },
    },
    rejectOnNotFound: true,
  })

  return membership.role === 'ADMIN'
}
