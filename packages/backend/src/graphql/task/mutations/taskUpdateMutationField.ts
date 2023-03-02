import { ForbiddenError } from 'apollo-server-core'

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
        select: { project: { select: { teamId: true } } },
        where: { id: id.toString() },
      })

      if (projectId) {
        const project = await prisma.project.findUniqueOrThrow({
          select: { teamId: true },
          where: { id: projectId.toString() },
        })

        if (task.project.teamId !== project.teamId) {
          throw new ForbiddenError('It is not allowed to move a task to a different team')
        }
      }
      return { isTeamAdminByTeamId: task.project.teamId }
    },
    resolve: (query, _source, { id, data: { title, projectId, hourlyRate } }) =>
      prisma.task.update({
        ...query,
        where: { id: id.toString() },
        data: { title: title ?? undefined, projectId: projectId?.toString(), hourlyRate },
      }),
  }),
)
