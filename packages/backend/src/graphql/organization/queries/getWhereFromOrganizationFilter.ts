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
    case OrganizationFilter.ACTIVE_OR_ARCHIVED:
      return {
        archivedAt: organizationFilter === OrganizationFilter.ACTIVE ? null : undefined,
      }
    case OrganizationFilter.ARCHIVED:
      return { archivedAt: { not: null } }
  }
}
