import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { OrganizationFilter, OrganizationFilterEnum } from '../organizationFilterEnum'
import { getWhereFromOrganizationFilter } from './getWhereFromOrganizationFilter'

builder.queryField('organizations', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Organization'],
    description: 'Returns all organizations of the signed in user that are active',
    args: {
      filter: t.arg({ type: OrganizationFilterEnum, defaultValue: OrganizationFilter.ACTIVE }),
    },
    resolve: (query, _source, { filter }, context) =>
      prisma.organization.findMany({
        ...query,
        where: {
          ...getWhereFromOrganizationFilter(filter),
          organizationMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
        orderBy: { title: 'asc' },
      }),
  }),
)
