import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskArchive', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Archive a task',
    args: {
      taskId: t.arg.id({ description: 'id of the task' }),
    },
    authScopes: async (_source, { taskId }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { teamId: true } } },
        where: { id: taskId.toString() },
      })

      return { isTeamAdminByTeamId: task.project.teamId }
    },
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
