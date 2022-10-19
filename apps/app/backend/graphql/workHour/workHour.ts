import { builder } from '../builder'
import { DateScalar } from '../scalars'

export const WorkHour = builder.prismaObject('WorkHour', {
  select: {},
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifies the work hour' }),
    date: t.expose('date', { type: DateScalar }),
    duration: t.exposeInt('duration', { description: 'Duration of the work hour in minutes' }),
    user: t.relation('user', { description: 'User who booked the work hours' }),
    project: t.field({
      type: 'Project',
      select: { task: { select: { project: { select: { id: true } } } } },
      resolve: (workHour) => workHour.task.project,
    }),
    task: t.relation('task', { description: 'Task for which the working hour was booked' }),
  }),
})
