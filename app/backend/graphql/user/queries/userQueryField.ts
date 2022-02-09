import { idArg, nullable, queryField } from 'nexus'
import { User } from '../user'

export const userQueryField = queryField('user', {
  type: User,
  description: 'Returns a single user',
  args: {
    userId: nullable(
      idArg({ description: 'Identifier for the user. If not provided, the logged in user is returned' }),
    ),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) => {
    if (!context.session?.user.id) {
      throw new Error('User not authenticated')
    }

    return context.prisma.user.findUnique({
      where: {
        id: _arguments.userId ?? context.session.user.id,
      },
      rejectOnNotFound: true,
    })
  },
})
