import { ForbiddenError } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

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
      taskId: t.arg.string(),
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
        hasUserId: workHour.userId,
      }
    },
    resolve: async (query, _source, { data, date, taskId }, context) => {
      const checkTaskInProject = await prisma.projectMembership.findFirst({
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

      if (!checkTaskInProject) throw new GraphQLError('Not authorized')

      const workHour = await prisma.workHour.findFirst({
        where: {
          date: date,
          taskId: taskId.toString(),
          userId: context.session.user.id,
        },
      })

      if (!workHour)
        return await prisma.workHour.create({
          data: {
            ...data,
            taskId: data.taskId.toString(),
            userId: context.session.user.id,
          },
        })

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
