import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'
import { DateScalar } from './../../scalars/date'
import { isProjectLocked } from './isProjectLocked'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['WorkHour'],
    description: 'Updates a work hour entry or creates if work hour does not exist',
    args: {
      data: t.arg({ type: WorkHourInput }),
      date: t.arg({ type: DateScalar }),
      taskId: t.arg.id(),
      userIds: t.arg.idList({
        required: false,
        description:
          "List of IDs of the project members whose work hours are being updated. If not provided, the signed-in user's work hours are updated.",
      }),
    },
    authScopes: async (_source, { data, date, taskId, userIds }, context) => {
      if (!context.session) return false

      const userIdList = userIds?.map((id) => id.toString()) ?? [context.session.user.id]

      const workHours = await prisma.workHour.findMany({
        select: { task: { select: { projectId: true } } },
        where: {
          date: date,
          taskId: taskId.toString(),
          userId: { in: userIdList },
        },
      })

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { projectId: true },
        where: { id: data.taskId.toString() },
      })

      const newProjectId = newAssignedTask.projectId

      if (workHours.length === 0) {
        return { isMemberByProject: newProjectId }
      }

      const oldProjectIds = workHours.map((workHour) => workHour.task.projectId)
      return { isMemberByProjects: [...oldProjectIds, newProjectId] }
    },
    resolve: async (query, _source, { data, date, taskId, userIds }, context) => {
      const userIdList = userIds?.map((id) => id.toString()) ?? [context.session.user.id]

      const previousTasks = await prisma.task.findMany({
        select: { projectId: true, isLocked: true },
        where: { id: { in: [taskId.toString(), data.taskId.toString()] } },
      })

      await Promise.all(
        previousTasks.map(async (previousTask) => {
          if (previousTask.isLocked) {
            throw new Error('task is locked')
          }

          if (await isProjectLocked({ date, projectId: previousTask.projectId })) {
            throw new Error('project is locked for the given month')
          }
        }),
      )

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { projectId: true, isLocked: true, project: { select: { archivedAt: true } } },
        where: { id: data.taskId.toString() },
      })

      if (newAssignedTask.isLocked) {
        throw new Error('task is locked')
      }

      if (newAssignedTask.project.archivedAt) {
        throw new Error('project is archived')
      }

      if (await isProjectLocked({ projectId: newAssignedTask.projectId, date: data.date })) {
        throw new Error('project is locked for the given month')
      }

      const results = await Promise.all(
        userIdList.map((userId) =>
          prisma.workHour.upsert({
            ...query,
            where: {
              date_userId_taskId: {
                date: date,
                userId: userId,
                taskId: data.taskId.toString(),
              },
            },
            create: { ...data, taskId: data.taskId.toString(), userId },
            update: { ...data, taskId: data.taskId.toString(), userId },
          }),
        ),
      )
      return results
    },
  }),
)
