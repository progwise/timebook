import { getMonth, getYear } from 'date-fns'

import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { WorkHour } from '../workHour'
import { MonthInputType } from './monthInputType'

export const Project = builder.prismaObject('Project', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the project' }),
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    workHours: t.field({
      type: [WorkHour],
      select: { tasks: { select: { workHours: { select: { id: true } } } } },
      resolve: (project) => project.tasks.flatMap((task) => task.workHours),
    }),
    tasks: t.relation('tasks', {
      args: {
        showArchived: t.arg.boolean({ defaultValue: false }),
      },
      query: ({ showArchived }) => ({
        where: {
          // eslint-disable-next-line unicorn/no-null
          archivedAt: showArchived ? undefined : null,
        },
        orderBy: { title: 'asc' },
      }),
    }),
    members: t.prismaField({
      description: 'List of users that are member of the project',
      select: { id: true },
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
          orderBy: { name: 'asc' },
        }),
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
  }),
})
