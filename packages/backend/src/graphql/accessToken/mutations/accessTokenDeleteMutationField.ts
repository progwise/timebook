import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('accessTokenDelete', (t) =>
  t.prismaField({
    type: 'AccessToken',
    description: 'Delete an access token for the signed in user',
    args: {
      id: t.arg.id(),
    },
    authScopes: async (_source, { id }) => {
      const accessToken = await prisma.accessToken.findUniqueOrThrow({
        select: { userId: true },
        where: { id: id.toString() },
      })

      return {
        hasUserId: accessToken.userId,
      }
    },
    resolve: (query, _source, { id }) => prisma.accessToken.delete({ ...query, where: { id: id.toString() } }),
  }),
)
