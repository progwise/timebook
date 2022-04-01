import { objectType } from 'nexus'
import { Task } from '../task'
import { WorkHour } from '../workHour'

export const ReportGroupedByTask = objectType({
  name: 'ReportGroupedByTask',
  definition: (t) => {
    t.field('task', {
      type: Task,
    })
    t.int('duration', { description: 'Sum of the total duration of all the work hours for the task' })
    t.list.field('workHours', {
      type: WorkHour,
    })
  },
})
