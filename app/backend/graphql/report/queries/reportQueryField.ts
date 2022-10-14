import { builder } from '../../builder'
import { DateScalar } from '../../scalars'

builder.queryField('report', (t) =>
  t.withAuth({ isTeamMember: true }).field({
    type: 'Report',
    description: 'Returns a monthly project report',
    authScopes: (_source, { projectId }) => ({ isProjectMember: projectId.toString(), isTeamAdmin: true }),
    args: {
      projectId: t.arg.id({ description: 'Project identifier' }),
      from: t.arg({ type: DateScalar }),
      to: t.arg({ type: DateScalar }),
    },
    resolve: (_source, { projectId, from, to }) => ({ projectId: projectId.toString(), from, to }),
  }),
)
