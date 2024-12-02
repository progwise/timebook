import { eachDayOfInterval, getMonth, getYear, subMinutes } from 'date-fns'

import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { DateScalar } from '../scalars'
import { WorkHourOfDayAndTask } from '../workHourOfDay/workHourOfDay'

export const Task = builder.prismaObject('Task', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifies the task' }),
    title: t.exposeString('title', { description: 'The user can identify the task in the UI' }),
    archived: t.boolean({
      select: { archivedAt: true },
      resolve: (task) => !!task.archivedAt,
    }),
    hasWorkHours: t.boolean({
      select: { id: true, _count: { select: { workHours: true } } },
      authScopes: (task) => ({ isMemberByTask: task.id }),
      resolve: (task) => task._count.workHours > 0,
    }),
    project: t.relation('project'),
    workHours: t.withAuth({ isLoggedIn: true }).relation('workHours', {
      args: {
        from: t.arg({ type: DateScalar, required: true }),
        to: t.arg({ type: DateScalar, required: false }),
      },
      query: ({ from, to }, context) => ({
        where: {
          userId: context.session.user.id,
          date: {
            gte: from,
            lte: to ?? from,
          },
        },
      }),
    }),
    workHourOfDays: t.withAuth({ isLoggedIn: true }).field({
      description: 'The work hours of the task for each day of the given interval',
      select: { id: true, projectId: true },
      type: [WorkHourOfDayAndTask],
      args: {
        from: t.arg({ type: DateScalar, required: true }),
        to: t.arg({ type: DateScalar, required: false }),
        projectMemberUserId: t.arg.id({
          required: false,
          description:
            'Filter work hours where the given user is a project member. If not given, the work hours of the signed in user are returned',
        }),
      },
      // when signed in user requests work hours for another user, the signed in user must be an admin

      authScopes: (task, { projectMemberUserId }, context) => {
        const showWorkHoursForOtherUser = projectMemberUserId && projectMemberUserId !== context.session.user.id
        return showWorkHoursForOtherUser ? { isAdminByTask: task.id } : { isLoggedIn: true }
      },

      resolve: async (task, { from, to, projectMemberUserId }, context) => {
        const interval = { start: from, end: to ?? from }
        return eachDayOfInterval(interval).map(async (date) => ({
          date: subMinutes(date, date.getTimezoneOffset()),
          taskId: task.id,
          userId: projectMemberUserId?.toString() ?? context.session.user.id,
        }))
      },
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { projectId: true },
      resolve: async (task, _arguments, context) => {
        const projectMembership = await prisma.projectMembership.findUnique({
          select: { projectRole: true },
          where: { userId_projectId: { projectId: task.projectId, userId: context.session.user.id } },
        })
        return projectMembership?.projectRole === 'ADMIN'
      },
    }),
    tracking: t.withAuth({ isLoggedIn: true }).prismaField({
      select: { id: true },
      type: 'Tracking',
      nullable: true,
      resolve: async (query, task, _argument, context) =>
        prisma.tracking.findUnique({ ...query, where: { userId: context.session.user.id, taskId: task.id } }),
    }),
    isLockedByAdmin: t.exposeBoolean('isLocked', { description: 'Is the task locked by an admin' }),
    isLocked: t.withAuth({ isLoggedIn: true }).boolean({
      select: { projectId: true, id: true, isLocked: true, project: { select: { archivedAt: true } } },
      resolve: async (task) => {
        if (task.isLocked || task.project.archivedAt) {
          return true
        }

        const now = new Date()
        const year = getYear(now)
        const month = getMonth(now)

        const lockedMonth = await prisma.lockedMonth.findUnique({
          where: {
            projectId_year_month: { projectId: task.projectId, year, month },
          },
        })

        return !!lockedMonth
      },
    }),
  }),
})
