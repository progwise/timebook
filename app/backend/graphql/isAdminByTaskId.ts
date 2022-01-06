import { Context } from './context'

export const isAdminByTaskId = async (taskId: string, context: Context): Promise<boolean> => {
  if (!context.session?.user.id) {
    return false
  }

  const membership = await context.prisma.projectMembership.findFirst({
    select: { role: true },
    where: {
      teamMembership: { userId: context.session.user.id },
      project: {
        tasks: {
          some: { id: taskId },
        },
      },
    },
    rejectOnNotFound: true,
  })

  return membership.role === 'ADMIN'
}
