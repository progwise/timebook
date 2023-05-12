import { getMonth, getYear } from 'date-fns'

import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { MonthInputType } from './monthInputType'

export const Project = builder.prismaObject('Project', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the project' }),
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    tasks: t.withAuth({ isLoggedIn: true }).relation('tasks', {
      description:
        'List of tasks that belong to the project. When the user is no longer a member of the project, only the tasks that the user booked work hours on are returned.',
      args: {
        showArchived: t.arg.boolean({ defaultValue: false }),
      },
      query: ({ showArchived }, context) => ({
        where: {
          // eslint-disable-next-line unicorn/no-null
          archivedAt: showArchived ? undefined : null,
          OR: [
            // the user is project member:
            { project: { projectMemberships: { some: { userId: context.session.user.id } } } },
            // the user booked work hours on the task:
            { workHours: { some: { userId: context.session.user.id } } },
          ],
        },
        orderBy: { title: 'asc' },
      }),
    }),
    members: t.prismaField({
      description: 'List of users that are member of the project',
      select: { id: true },
      authScopes: (project) => ({ isMemberByProject: project.id }),
      type: ['User'],
      args: {
        includePastMembers: t.arg.boolean({
          defaultValue: false,
          description:
            'Set this to true if you want to see also the users who booked work hours on this project, but are no longer project members. This arg is useful for e.g. reports.',
        }),
      },
      resolve: (query, project, { includePastMembers }) =>
        prisma.user.findMany({
          ...query,
          where: includePastMembers
            ? {
                OR: [
                  { projectMemberships: { some: { projectId: project.id } } },
                  { workhours: { some: { task: { projectId: project.id } } } },
                ],
              }
            : {
                projectMemberships: { some: { projectId: project.id } },
              },
          orderBy: [{ id: 'asc' }, { name: 'asc' }],
        }),
    }),
    inviteKey: t.exposeString('inviteKey'),
    role: t.withAuth({ isLoggedIn: true }).string({
      description: 'Can the user modify the entity',
      select: { id: true },
      resolve: async (project, _arguments, context) => {
        const projectMembership = await prisma.projectMembership.findUnique({
          select: { role: true },
          where: { userId_projectId: { projectId: project.id, userId: context.session.user.id } },
        })

        return projectMembership?.role ?? 'NONE'
      },
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { id: true },
      resolve: async (project, _arguments, context) => {
        const projectMembership = await prisma.projectMembership.findUnique({
          select: { role: true },
          where: { userId_projectId: { projectId: project.id, userId: context.session.user.id } },
        })

        return projectMembership?.role === 'ADMIN'
      },
    }),
    isLocked: t.withAuth({ isLoggedIn: true }).boolean({
      select: { id: true },
      args: {
        date: t.arg({
          type: MonthInputType,
          required: false,
          description: 'The month to check. If empty the current month is used.',
        }),
      },
      description: 'Is the project locked for the given month',
      resolve: async (project, { date }) => {
        const now = new Date()
        const year = date?.year ?? getYear(now)
        const month = date?.month ?? getMonth(now)

        const lockedMonth = await prisma.lockedMonth.findUnique({
          where: { projectId_year_month: { projectId: project.id, month, year } },
        })

        return !!lockedMonth
      },
    }),
    isProjectMember: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Is the user member of the project',
      select: { id: true },
      resolve: async (project, _arguments, context) => {
        const projectMembership = await prisma.projectMembership.findUnique({
          where: { userId_projectId: { projectId: project.id, userId: context.session.user.id } },
        })

        return !!projectMembership
      },
    }),
    isArchived: t.boolean({
      select: { archivedAt: true },
      resolve: (project) => !!project.archivedAt,
    }),
    hasWorkHours: t.boolean({
      select: { id: true },
      resolve: async (project) => {
        const workHoursCount = await prisma.workHour.count({ where: { task: { projectId: project.id } } })
        return workHoursCount > 0
      },
    }),
  }),
})
