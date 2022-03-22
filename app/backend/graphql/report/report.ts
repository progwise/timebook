import { objectType } from 'nexus'
import { ReportGroupedByDate } from './reportGroupedByDate'
import { ReportGroupedByTask } from './reportGroupedByTask'

export const Report = objectType({
  name: 'Report',
  definition: (t) => {
    t.list.field('groupedByTask', {
      type: ReportGroupedByTask,
    })
    t.list.field('groupedByDate', {
      type: ReportGroupedByDate,
    })
  },
})
