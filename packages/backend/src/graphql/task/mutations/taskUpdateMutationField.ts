import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TaskUpdateInput } from '../taskUpdateInput'

builder.mutationField('taskUpdate', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Update a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
      data: t.arg({ type: TaskUpdateInput }),
    },
    authScopes: async (_source, { id, data: { projectId } }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { projectId: true },
        where: { id: id.toString() },
      })

      const oldProjectId = task.projectId
      if (projectId) {
        const newProjectId = projectId.toString()
        return { isAdminByProjects: [oldProjectId, newProjectId] }
      }

      return { isAdminByProject: oldProjectId }
    },
    resolve: (query, _source, { id, data: { title, projectId, hourlyRate } }) =>
      prisma.task.update({
        ...query,
        where: { id: id.toString() },
        data: { title: title ?? undefined, projectId: projectId?.toString(), hourlyRate },
      }),
  }),
)
