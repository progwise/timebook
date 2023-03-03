import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TaskInput } from '../taskInput'

builder.mutationField('taskCreate', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Create a new Task',
    args: {
      data: t.arg({ type: TaskInput }),
    },
    authScopes: (_source, { data: { projectId } }) => ({ isProjectMember: projectId.toString() }),
    resolve: (query, _source, { data: { title, projectId, hourlyRate } }) =>
      prisma.task.create({
        ...query,
        data: {
          title,
          projectId: projectId.toString(),
          hourlyRate,
        },
      }),
  }),
)
