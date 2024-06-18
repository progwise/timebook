/* eslint-disable unicorn/no-null */
import { Prisma } from '@progwise/timebook-prisma'

import { OrganizationFilter } from '../organizationsFilterEnum'

export const getWhereFromOrganizationFilter = (
  organizationFilter: OrganizationFilter,
): Prisma.OrganizationWhereInput => {
  switch (organizationFilter) {
    case OrganizationFilter.ALL:
      return {}
    case OrganizationFilter.ACTIVE:
      return {
        archivedAt: null,
      }
    case OrganizationFilter.ARCHIVED:
      return { archivedAt: { not: null } }
  }
}
