import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('accessTokenDelete', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'AccessToken',
    description: 'Delete an access token for the signed in user',
    args: {
      id: t.arg.id(),
    },
    resolve: (_query, _source, { id }) => prisma.accessToken.delete({ where: { id: id.toString() } }),
  }),
)
