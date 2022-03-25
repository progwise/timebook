import { arg, idArg, queryField } from 'nexus'
import { Report } from '../report'

export interface ReportSource {
  projectId: string
  from: Date
  to: Date
}

export const reportQueryField = queryField('report', {
  type: Report,
  description: 'Returns a monthly project report',
  args: {
    projectId: idArg({ description: 'Project identifier' }),
    from: arg({ type: 'Date' }),
    to: arg({ type: 'Date' }),
  },
  resolve: (_source, arguments_) => arguments_,
})
