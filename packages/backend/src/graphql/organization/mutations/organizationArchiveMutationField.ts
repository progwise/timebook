import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('organizationArchive', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Archive an organization',
    authScopes: async (_source, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    args: {
      organizationId: t.arg.id({ description: 'id of the organization' }),
    },
    resolve: async (query, _source, { organizationId }) =>
      prisma.organization.update({
        ...query,
        where: { id: organizationId.toString() },
        data: {
          archivedAt: new Date(),
        },
      }),
  }),
)
