import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'
import { User } from '../user'
import { WorkHour } from '../workHour'

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
      }),
    }),
    customer: t.relation('customer', { nullable: true, description: 'Customer of the project' }),
    members: t.field({
      description: 'List of users that are member of the project',
      select: { projectMemberships: { select: { user: true } } },
      type: [User],
      resolve: (project) => project.projectMemberships.map((projectMembership) => projectMembership.user),
    }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { teamId: true },
      resolve: async (project, _arguments, context) => {
        const teamMembership = await prisma.teamMembership.findUnique({
          select: { role: true },
          where: {
            userId_teamId: {
              teamId: project.teamId,
              userId: context.session.user.id,
            },
          },
        })
        return teamMembership?.role === 'ADMIN'
      },
    }),
  }),
})
