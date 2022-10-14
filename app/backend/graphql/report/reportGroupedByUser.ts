import { builder } from '../builder'
import { User } from '../user'
import { WorkHour } from '../workHour'

export const ReportGroupedByUser = builder.simpleObject('ReportGroupedByUser', {
  fields: (t) => ({
    user: t.field({ type: User }),
    workHours: t.field({ type: [WorkHour] }),
    duration: t.int({ description: 'Sum of the total duration of all the work hours for a specific user' }),
  }),
})
