import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TaskInput } from '../taskInput'

builder.mutationField('taskUpdate', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Update a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
      data: t.arg({ type: TaskInput }),
    },
    authScopes: async (_source, { id, data: { projectId } }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { projectId: true },
        where: { id: id.toString() },
      })

      return {
        $all: {
          isProjectMember: task.projectId,
          // Using $all allows us to run the isProjectMember check twice, once for the previous project and once for the new assigned project
          $all: { isProjectMember: projectId.toString() },
        },
      }
    },
    resolve: (query, _source, { id, data: { title, projectId } }) =>
      prisma.task.update({
        ...query,
        where: { id: id.toString() },
        data: { title, projectId: projectId.toString() },
      }),
  }),
)
