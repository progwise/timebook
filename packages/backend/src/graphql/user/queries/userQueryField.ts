import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('user', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'User',
    description: 'Returns a single user',
    args: {
      userId: t.arg.id({
        required: false,
        description: 'Identifier for the user. If not provided, the logged in user is returned',
      }),
    },
    resolve: (query, _source, { userId }, context) =>
      prisma.user.findUniqueOrThrow({ ...query, where: { id: userId?.toString() ?? context.session.user.id } }),
  }),
)
