import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('taskDelete', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Task',
    description: 'Delete a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
    },
    resolve: (query, _source, { id }) =>
      prisma.task.delete({
        ...query,
        where: { id: id.toString() },
      }),
  }),
)
