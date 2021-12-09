import { list, queryField } from 'nexus'
import { User } from '../user'

export const usersQeryField = queryField('users', {
  type: list(User),
  resolve: (source, _arguments, context) => {
    return context.prisma.user.findMany()
  },
})
