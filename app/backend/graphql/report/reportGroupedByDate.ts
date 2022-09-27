import { builder } from '../builder'
import { DateScalar } from '../scalars'
import { WorkHour } from '../workHour'

export const ReportGroupedByDate = builder.simpleObject('ReportGroupedByDate', {
  fields: (t) => ({
    date: t.field({ type: DateScalar, description: 'Booking date of the work hour' }),
    workHours: t.field({ type: [WorkHour] }),
    duration: t.int({ description: 'Sum of the total duration of all the work hours for the specific date' }),
  }),
})
