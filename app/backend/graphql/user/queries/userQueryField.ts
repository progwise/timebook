import { idArg, queryField } from 'nexus'
import { User } from '../user'

export const userQueryField = queryField('user', {
  type: User,
  description: 'Returns a single user',
  args: {
    userId: idArg({ description: 'Identifier for the user' }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) => {
    if (!context.session?.user.id) {
      throw new Error('User not authenticated')
    }
    return context.prisma.user.findUnique({
      where: {
        id: _arguments.userId,
      },
      rejectOnNotFound: true,
    })
  },
})
