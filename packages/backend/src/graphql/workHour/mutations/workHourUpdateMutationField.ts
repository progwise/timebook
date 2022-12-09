import { ForbiddenError } from 'apollo-server-core'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'
import { DateScalar } from './../../scalars/date'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry or creates if work hour does not exist',
    args: {
      data: t.arg({ type: WorkHourInput }),
      date: t.arg({ type: DateScalar }),
      taskId: t.arg.id(),
    },
    authScopes: async (_source, { data, date, taskId }, context) => {
      if (!context.session) return false

      const workHour = await prisma.workHour.findUnique({
        select: {
          task: { select: { project: { select: { teamId: true } } } },
          userId: true,
        },
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
        },
      })

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { project: { select: { teamId: true, id: true } } },
        where: { id: data.taskId.toString() },
      })

      if (!workHour)
        return {
          isProjectMember: newAssignedTask.project.id,
        }

      if (workHour.task.project.teamId !== newAssignedTask.project.teamId) {
        throw new ForbiddenError('It is not allowed to move a work hour to a different team')
      }

      return {
        isTeamAdminByTeamId: workHour.task.project.teamId,
        $all: {
          hasUserId: workHour.userId,
          isProjectMember: newAssignedTask.project.id,
        },
      }
    },
    resolve: (query, _source, { data, date, taskId }, context) =>
      prisma.workHour.upsert({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
        },
        create: { ...data, taskId: data.taskId.toString(), userId: context.session.user.id },
        update: { ...data, taskId: data.taskId.toString(), userId: context.session.user.id },
      }),
  }),
)
