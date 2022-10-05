import { objectType } from 'nexus'
import { WorkHour } from '../workHour'

export const ReportGroupedByDate = objectType({
  name: 'ReportGroupedByDate',
  definition: (t) => {
    t.date('date', { description: 'Booking date of the work hour' })
    t.list.field('workHours', {
      type: WorkHour,
    })
    t.int('duration', { description: 'Sum of the total duration of all the work hours for the specific date' })
  },
})
