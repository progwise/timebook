/* eslint-disable unicorn/no-null */
import { Prisma } from '@progwise/timebook-prisma'
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'
import { ProjectFilter, ProjectFilterEnum } from '../projectsFilterEnum'

const getWhereFromProjectFilter = (projectFilter: ProjectFilter, from: Date, to: Date): Prisma.ProjectWhereInput => {
  switch (projectFilter) {
    case ProjectFilter.ALL:
      return {}
    case ProjectFilter.ACTIVE:
      return {
        AND: [
          {
            OR: [
              {
                startDate: {
                  lte: to ?? from,
                },
              },
              {
                startDate: {
                  equals: null,
                },
              },
            ],
          },
          {
            OR: [
              {
                endDate: {
                  gte: from,
                },
              },
              {
                endDate: {
                  equals: null,
                },
              },
            ],
          },
        ],
      }
    case ProjectFilter.PAST:
      return { endDate: { lte: from } }
    case ProjectFilter.FUTURE:
      return { startDate: { gte: to ?? from } }
  }
}

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
