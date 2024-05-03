import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { OrganizationInput } from '../organizationInput'

builder.mutationField('organizationUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Update an organization',
    args: {
      id: t.arg.id(),
      data: t.arg({ type: OrganizationInput }),
    },
    resolve: async (query, _source, { id, data: { title, address } }, context) => {
      const now = new Date()

      return prisma.organization.update({
        ...query,
        data: {
          title,
          address,
          organizationMemberships: {
            create: {
              userId: context.session.user.id,
            },
          },
        },
        where: {
          id: id.toString(),
        },
      })
    },
  }),
)
