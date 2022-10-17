import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TaskInput } from '../taskInput'

builder.mutationField('taskUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Task',
    description: 'Update a task',
    args: {
      id: t.arg.id({ description: 'id of the task' }),
      data: t.arg({ type: TaskInput }),
    },
    authScopes: async (_source, { id, data: { projectId } }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { teamId: true } } },
        where: { id: id.toString() },
      })
      const project = await prisma.project.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: projectId.toString() },
      })

      if (task.project.teamId !== project.teamId) {
        throw new ForbiddenError('It is not allowed to move a task to a different team')
      }

      return { isTeamAdminByTeamId: task.project.teamId }
    },
    resolve: (query, _source, { id, data: { title, projectId } }) =>
      prisma.task.update({
        ...query,
        where: { id: id.toString() },
        data: { title, projectId: projectId.toString() },
      }),
  }),
)
