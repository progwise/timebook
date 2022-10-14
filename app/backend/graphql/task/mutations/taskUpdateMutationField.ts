import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TaskInput } from '../taskInput'

builder.mutationField('taskUpdate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Task',
    description: 'Update a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
      data: t.arg({ type: TaskInput }),
    },
    resolve: (query, _source, { id, data: { title, projectId } }) =>
      prisma.task.update({
        ...query,
        where: { id: id.toString() },
        data: { title, projectId: projectId.toString() },
      }),
  }),
)
