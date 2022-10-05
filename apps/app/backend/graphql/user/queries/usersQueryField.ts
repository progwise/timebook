import { list, queryField } from 'nexus'
import { User } from '../user'

export const usersQueryField = queryField('users', {
  type: list(User),
  deprecation: 'Use members field on team type instead',
  resolve: (source, _arguments, context) => {
    return context.prisma.user.findMany()
  },
})
