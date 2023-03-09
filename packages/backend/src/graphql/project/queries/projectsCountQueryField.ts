import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars/date'
import { ProjectFilterEnum } from '../projectsFilterEnum'
import { getWhereFromProjectFilter } from './getWhereFormProjectFilter'

export const projectsCountQueryField = builder.queryField('projectsCount', (t) =>
  t.withAuth({ isLoggedIn: true }).int({
    args: {
      from: t.arg({ type: DateScalar, required: true }),
      to: t.arg({ type: DateScalar, required: false }),
      filter: t.arg({ type: ProjectFilterEnum }),
    },
    resolve: (_source, { from, to, filter }, context) =>
      prisma.project.count({
        where: {
          ...getWhereFromProjectFilter(filter, from, to ?? from),
          projectMemberships: { some: { userId: context.session.user.id } },
        },
      }),
  }),
)
