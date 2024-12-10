import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'
import { DateScalar } from './../../scalars/date'
import { isProjectLocked } from './isProjectLocked'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry or creates if work hour does not exist',
    args: {
      data: t.arg({ type: WorkHourInput }),
      date: t.arg({ type: DateScalar }),
      taskId: t.arg.id(),
      projectMemberUserId: t.arg.id({
        required: false,
        description:
          "ID of the project member whose work hours are being updated. If not provided, the signed-in user's work hours are updated.",
      }),
    },
    authScopes: async (_source, { data, date, taskId, projectMemberUserId }, context) => {
      if (!context.session) return false

      const userId = projectMemberUserId?.toString() ?? context.session.user.id

      const workHour = await prisma.workHour.findUnique({
        select: { task: { select: { projectId: true } } },
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId },
        },
      })

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { projectId: true },
        where: { id: data.taskId.toString() },
      })

      const newProjectId = newAssignedTask.projectId

      if (!workHour) {
        return { isMemberByProject: newProjectId }
      }

      const oldProjectId = workHour.task.projectId
      return { isMemberByProjects: [oldProjectId, newProjectId] }
    },
    resolve: async (query, _source, { data, date, taskId, projectMemberUserId }, context) => {
      const userId = projectMemberUserId?.toString() ?? context.session.user.id

      const previousTask = await prisma.task.findUnique({
        select: { projectId: true, isLocked: true },
        where: { id: taskId.toString() },
      })

      if (previousTask?.isLocked) {
        throw new Error('task is locked')
      }

      if (previousTask && (await isProjectLocked({ date, projectId: previousTask.projectId }))) {
        throw new Error('project is locked for the given month')
      }

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

      return prisma.workHour.upsert({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId },
        },
        create: { ...data, taskId: data.taskId.toString(), userId },
        update: { ...data, taskId: data.taskId.toString(), userId },
      })
    },
  }),
)
