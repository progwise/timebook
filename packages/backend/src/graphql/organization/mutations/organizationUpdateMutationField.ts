import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { OrganizationInput } from '../organizationInput'

builder.mutationField('organizationUpdate', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Update an organization',
    authScopes: async (_source, { id }) => ({ isAdminByOrganization: id.toString() }),
    args: {
      id: t.arg.id(),
      data: t.arg({ type: OrganizationInput }),
    },
    resolve: async (query, _source, { id, data: { title, address } }) => {
      return prisma.organization.update({
        ...query,
        data: {
          title,
          address,
          updatedAt: new Date(),
        },
        where: {
          id: id.toString(),
        },
      })
    },
  }),
)
