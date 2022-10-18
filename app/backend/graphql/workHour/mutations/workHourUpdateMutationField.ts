import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'

builder.mutationField('workHourUpdate', (t) =>
  t.prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry',
    args: {
      id: t.arg.id({ description: 'id of the work hour item' }),
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: async (_source, { id, data }) => {
      const workHour = await prisma.workHour.findUniqueOrThrow({
        select: {
          task: { select: { project: { select: { teamId: true } } } },
          userId: true,
        },
        where: { id: id.toString() },
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
    resolve: (query, _source, { id, data: { date, duration, taskId } }) =>
      prisma.workHour.update({
        ...query,
        where: { id: id.toString() },
        data: {
          date: date,
          duration: duration,
          taskId: taskId.toString(),
        },
      }),
  }),
)
