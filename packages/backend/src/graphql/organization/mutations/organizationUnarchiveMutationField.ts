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
      const organization = await prisma.organization.findUnique({
        select: { archivedAt: true },
        where: { id: organizationId },
      })

      if (!organization) {
        throw new Error('Organization not found')
      }

      if (organization.archivedAt === null) {
        return prisma.organization.findUniqueOrThrow({ ...query, where: { id: organizationId } })
      }

      return prisma.organization.update({
        ...query,
        where: { id: organizationId },
        data: { archivedAt: null },
      })
    },
  }),
)
