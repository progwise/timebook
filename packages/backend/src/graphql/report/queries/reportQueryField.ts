import { startOfMonth, endOfMonth } from 'date-fns'

import { builder } from '../../builder'

builder.queryField('report', (t) =>
  t.field({
    type: 'Report',
    description: 'Returns a monthly project report',
    authScopes: (_source, { projectId }) => ({ isMemberByProject: projectId.toString() }),
    args: {
      projectId: t.arg.id({ description: 'Project identifier' }),
      year: t.arg.int(),
      month: t.arg.int(),
      userId: t.arg.id({ required: false, description: 'if not set all users will be included in the report' }),
    },
    resolve: (_source, { projectId, year, month, userId }) => ({
      projectId: projectId.toString(),
      from: startOfMonth(new Date(year, month)),
      to: endOfMonth(new Date(year, month)),
      year,
      month,
      userId: userId?.toString() ?? undefined,
    }),
  }),
)
