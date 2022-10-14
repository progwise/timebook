import { builder } from '../../builder'
import { TaskInput } from '../taskInput'
import { prisma } from '../../prisma'

builder.mutationField('taskCreate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Task',
    description: 'Create a new Task',
    args: {
      data: t.arg({ type: TaskInput }),
    },
    resolve: (query, _source, { data: { title, projectId } }) =>
      prisma.task.create({
        ...query,
        data: {
          title,
          projectId: projectId.toString(),
        },
      }),
  }),
)
