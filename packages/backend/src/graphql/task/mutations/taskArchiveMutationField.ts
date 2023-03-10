import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskArchive', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Archive a task',
    args: {
      taskId: t.arg.id({ description: 'id of the task' }),
    },
    authScopes: async (_source, { taskId }) => ({ isAdminByTask: taskId.toString() }),
    resolve: (query, _source, { taskId }) =>
      prisma.task.update({
        ...query,
        where: { id: taskId.toString() },
        data: {
          archivedAt: new Date(),
        },
      }),
  }),
)
