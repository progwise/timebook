import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('accessTokens', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['AccessToken'],
    description: 'List of tokens of the signed in user',
    resolve: (query, _source, _arguments, context) => {
      return prisma.accessToken.findMany({ ...query, where: { userId: context.session.user.id } })
    },
  }),
)
