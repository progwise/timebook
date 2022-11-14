import { ForbiddenError } from 'apollo-server-core'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry',
    args: {
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: async (_source, { data }, context) => {
      if (!context.session) return false

      const workHour = await prisma.workHour.findUniqueOrThrow({
        select: {
          task: { select: { project: { select: { teamId: true } } } },
          userId: true,
        },
        where: {
          date_userId_taskId: { date: data.date, taskId: data.taskId.toString(), userId: context.session.user.id },
        },
      })

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { teamId: true } } },
        where: { id: data.taskId.toString() },
      })

      if (workHour.task.project.teamId !== newAssignedTask.project.teamId) {
        throw new ForbiddenError('It is not allowed to move a work hour to a different team')
      }

      return {
        isTeamAdminByTeamId: workHour.task.project.teamId,
        hasUserId: workHour.userId,
      }
    },
    resolve: (query, _source, { data: { date, taskId, duration } }, context) => {
      return prisma.workHour.update({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
        },
        data: {
          date: date,
          duration: duration,
          taskId: taskId.toString(),
        },
      })
    },
  }),
)
