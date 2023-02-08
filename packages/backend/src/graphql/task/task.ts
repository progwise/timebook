import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'

export const Task = builder.prismaObject('Task', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifies the task' }),
    title: t.exposeString('title', { description: 'The user can identify the task in the UI' }),
    hourlyRate: t.float({
      nullable: true,
      description: 'For calculating the money spent',
      select: { hourlyRate: true },
      resolve: (task) => task.hourlyRate?.toNumber(),
    }),
    archived: t.boolean({
      select: { archivedAt: true },
      resolve: (task) => !!task.archivedAt,
    }),
    hasWorkHours: t.boolean({
      select: { _count: { select: { workHours: true } } },
      resolve: (task) => task._count.workHours > 0,
    }),
    project: t.relation('project'),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { project: { select: { teamId: true } } },
      resolve: async (task, _arguments, context) => {
        const teamMembership = await prisma.teamMembership.findUnique({
          select: { role: true },
          where: {
            userId_teamId: {
              teamId: task.project.teamId,
              userId: context.session.user.id,
            },
          },
        })
        return teamMembership?.role === 'ADMIN'
      },
    }),
  }),
})
