import { ForbiddenError } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'
import { DateScalar } from './../../scalars/date'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry',
    args: {
      data: t.arg({ type: WorkHourInput }),
      date: t.arg({ type: DateScalar }),
      taskId: t.arg.string(),
    },
    authScopes: async (_source, { data, date, taskId }, context) => {
      if (!context.session) return false

      const workHour = await prisma.workHour.findUniqueOrThrow({
        select: {
          task: { select: { project: { select: { teamId: true } } } },
          userId: true,
        },
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
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
    resolve: async (query, _source, { data, date, taskId }, context) => {
      const projectWithUser = await prisma.projectMembership.findFirst({
        where: {
          userId: context.session.user.id,
          project: {
            tasks: {
              some: {
                id: taskId.toString(),
              },
            },
          },
        },
      })

      if (!projectWithUser) throw new GraphQLError('Not authorized')

      return await prisma.workHour.update({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
        },
        data: { ...data, taskId: data.taskId.toString() },
      })
    },
  }),
)
