import { objectType } from 'nexus'
import { ReportGroupedByTask } from './reportGroupedBytask'

export const Report = objectType({
  name: 'Report',
  definition: (t) => {
    t.list.field('groupedByTask', {
      type: ReportGroupedByTask,
    })
  },
})
