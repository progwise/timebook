import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('task', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'Task',
    description: 'Returns a single task',
    args: {
      taskId: t.arg.id({ description: 'Identifier for the task' }),
    },
    authScopes: async (_source, { taskId }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { id: true, teamId: true } } },
        where: { id: taskId.toString() },
      })

      return {
        isTeamAdminByTeamId: task.project.teamId,
        isProjectMember: task.project.id,
      }
    },
    resolve: (query, _source, { taskId }) =>
      prisma.task.findUniqueOrThrow({
        ...query,
        where: { id: taskId.toString() },
      }),
  }),
)
