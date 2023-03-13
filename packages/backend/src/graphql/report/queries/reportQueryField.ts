import { builder } from '../../builder'
import { DateScalar } from '../../scalars'

builder.queryField('report', (t) =>
  t.field({
    type: 'Report',
    description: 'Returns a monthly project report',
    authScopes: (_source, { projectId }) => ({ isMemberByProject: projectId.toString() }),
    args: {
      projectId: t.arg.id({ description: 'Project identifier' }),
      from: t.arg({ type: DateScalar }),
      to: t.arg({ type: DateScalar }),
      userId: t.arg.id({ required: false, description: 'if not set all users will be included in the report' }),
    },
    resolve: (_source, { projectId, from, to, userId }) => ({
      projectId: projectId.toString(),
      from,
      to,
      userId: userId?.toString() ?? undefined,
    }),
  }),
)
