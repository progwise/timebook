import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskUnlock', (t) => {
  return t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Task',
    args: {
      taskId: t.arg.id(),
    },
    description: 'Unlock a task for the current user',
    authScopes: (_source, { taskId }) => ({ isMemberByTask: taskId.toString() }),
    resolve: async (query, _source, arguments_, context) => {
      const taskId = arguments_.taskId.toString()
      const userId = context.session.user.id

      const lockedTaskCount = await prisma.lockedTask.count({ where: { taskId, userId } })
      if (lockedTaskCount === 0) {
        return prisma.task.findUniqueOrThrow({ ...query, where: { id: taskId } })
      }

      const deleteLockedTask = await prisma.lockedTask.delete({
        select: { task: query },
        where: { taskId_userId: { taskId, userId } },
      })
      return deleteLockedTask.task
    },
  })
})
