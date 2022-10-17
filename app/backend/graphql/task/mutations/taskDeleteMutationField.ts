import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskDelete', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Task',
    description: 'Delete a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
    },
    authScopes: async (_source, { id }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { teamId: true } } },
        where: { id: id.toString() },
      })
      return { isTeamAdminByTeamId: task.project.teamId }
    },
    resolve: (query, _source, { id }) =>
      prisma.task.delete({
        ...query,
        where: { id: id.toString() },
      }),
  }),
)
