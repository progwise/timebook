import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskLock', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Task',
    description: 'Lock a task for the current user',
    args: {
      taskId: t.arg.id(),
    },
    authScopes: (_source, { taskId }) => ({ isMemberByTask: taskId.toString() }),
    resolve: async (query, _source, arguments_, context) => {
      const taskId = arguments_.taskId.toString()
      const userId = context.session.user.id

      const lockedTask = await prisma.lockedTask.upsert({
        select: { task: query },
        where: { taskId_userId: { taskId, userId } },
        create: { taskId, userId },
        update: {},
      })

      return lockedTask.task
    },
  }),
)
