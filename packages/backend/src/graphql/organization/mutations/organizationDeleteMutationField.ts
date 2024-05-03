import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('organizationDelete', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Delete an organization',
    authScopes: async (_source, { id }) => ({ isAdminByOrganization: id.toString() }),
    args: {
      id: t.arg.id({ description: 'id of the organization' }),
    },
    resolve: async (query, _source, { id }) =>
      prisma.organization.update({
        ...query,
        where: { id: id.toString() },
        data: {
          archivedAt: new Date(),
        },
      }),
  }),
)
