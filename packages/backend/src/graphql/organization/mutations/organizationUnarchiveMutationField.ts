/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('organizationUnarchive', (t) =>
  t.prismaField({
    type: 'Organization',
    description: 'Unarchive an organization',
    args: {
      organizationId: t.arg.id(),
    },
    authScopes: (_source, { organizationId }) => ({ isAdminByOrganization: organizationId.toString() }),
    resolve: async (query, _source, arguments_) => {
      const organizationId = arguments_.organizationId.toString()

      return prisma.organization.update({
        ...query,
        where: { id: organizationId },
        data: { archivedAt: null },
      })
    },
  }),
)
