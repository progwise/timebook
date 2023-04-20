/* eslint-disable unicorn/no-null */
import { Prisma } from '@progwise/timebook-prisma'

import { ProjectFilter } from '../projectsFilterEnum'

export const getWhereFromProjectFilter = (
  projectFilter: ProjectFilter,
  from: Date,
  to: Date,
): Prisma.ProjectWhereInput => {
  switch (projectFilter) {
    case ProjectFilter.ALL:
      return {}
    case ProjectFilter.ACTIVE:
      return {
        archivedAt: null,
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
      return { archivedAt: null, endDate: { lte: from } }
    case ProjectFilter.FUTURE:
      return { archivedAt: null, startDate: { gte: to ?? from } }
    case ProjectFilter.ARCHIVED:
      return { archivedAt: { not: null } }
  }
}
