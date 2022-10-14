import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'

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
    workhours: t.relation('workHours'),
  }),
})
