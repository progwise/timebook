import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskDelete', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Delete a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
    },
    authScopes: async (_source, { id }) => {
      const task = await prisma.task.findUniqueOrThrow({ where: { id: id.toString() } })
      return { isProjectMember: task.projectId }
    },
    resolve: (query, _source, { id }) =>
      prisma.task.delete({
        ...query,
        where: { id: id.toString() },
      }),
  }),
)
