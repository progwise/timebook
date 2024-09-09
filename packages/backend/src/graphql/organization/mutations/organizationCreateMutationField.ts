import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { OrganizationInput } from '../organizationInput'

builder.mutationField('organizationCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Create a new organization',
    args: {
      data: t.arg({ type: OrganizationInput }),
    },
    resolve: async (query, _source, { data: { title, address } }, context) => {
      return prisma.organization.create({
        ...query,
        data: {
          title,
          address,
          organizationMemberships: {
            create: {
              userId: context.session.user.id,
              role: 'ADMIN',
            },
          },
        },
      })
    },
  }),
)
