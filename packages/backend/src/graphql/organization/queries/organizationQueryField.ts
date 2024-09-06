import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('organization', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Organization',
    description: 'Returns a single Organization',
    args: {
      organizationId: t.arg.id({ description: 'Identifier for the Organization' }),
    },

    // authScopes: async (_source, { organizationId }, context) => {
    //   const organization = await prisma.organization.findUnique({
    //     where: { id: organizationId.toString() },
    //     include: {
    //       projects: {
    //         select: { id: true },
    //         where: {
    //           projectMemberships: {
    //             some: { userId: context.session.user.id },
    //           },
    //         },
    //       },
    //     },
    //   })

    //   if (organization?.projects.length) {
    //     return true
    //   }

    //   return { isAdminByOrganization: organizationId.toString() }
    // },
    resolve: (query, _source, { organizationId }) =>
      prisma.organization.findUniqueOrThrow({
        ...query,
        where: { id: organizationId.toString() },
      }),
  }),
)
