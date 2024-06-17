import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { OrganizationFilterEnum } from '../organizationsFilterEnum'
import { getWhereFromOrganizationFilter } from './getWhereFromOrganizationFilter'

export const organizationsCountQueryField = builder.queryField('organizationsCount', (t) =>
  t.withAuth({ isLoggedIn: true }).int({
    args: {
      filter: t.arg({ type: OrganizationFilterEnum }),
    },
    resolve: (_source, { filter }, context) =>
      prisma.organization.count({
        where: {
          ...getWhereFromOrganizationFilter(filter),
          organizationMemberships: { some: { userId: context.session.user.id } },
        },
      }),
  }),
)
