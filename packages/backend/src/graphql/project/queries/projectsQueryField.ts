import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'
import { ProjectFilter, ProjectFilterEnum } from '../projectsFilterEnum'
import { getWhereFromProjectFilter } from './getWhereFormProjectFilter'

builder.queryField('projects', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Project'],
    description: 'Returns all project of the signed in user that are active',
    args: {
      from: t.arg({ type: DateScalar, required: true }),
      to: t.arg({ type: DateScalar, required: false }),
      filter: t.arg({ type: ProjectFilterEnum, defaultValue: ProjectFilter.ACTIVE }),
    },
    resolve: (query, _source, { from, to, filter }, context) =>
      prisma.project.findMany({
        ...query,
        where: {
          ...getWhereFromProjectFilter(filter, from, to ?? from),
          projectMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
        orderBy: { title: 'asc' },
      }),
  }),
)
