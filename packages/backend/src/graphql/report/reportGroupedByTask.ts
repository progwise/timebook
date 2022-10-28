import { builder } from '../builder'
import { Task } from '../task'
import { WorkHour } from '../workHour'

export const ReportGroupedByTask = builder.simpleObject('ReportGroupedByTask', {
  fields: (t) => ({
    task: t.field({ type: Task }),
    workHours: t.field({ type: [WorkHour] }),
    duration: t.int({ description: 'Sum of the total duration of all the work hours for the task' }),
  }),
})
