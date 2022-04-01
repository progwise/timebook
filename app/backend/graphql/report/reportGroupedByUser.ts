import { objectType } from 'nexus'
import { User } from '../user'
import { WorkHour } from '../workHour'

export const ReportGroupedByUser = objectType({
  name: 'ReportGroupedByUser',
  definition: (t) => {
    t.field('user', {
      type: User,
    })
    t.list.field('workHours', {
      type: WorkHour,
    })
    t.int('duration', { description: 'Sum of the total duration of all the work hours for a specific user' })
  },
})
