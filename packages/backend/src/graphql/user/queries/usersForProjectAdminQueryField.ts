import { GraphQLError } from 'graphql'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { getWhereUserIsMember } from '../../project/queries/getWhereUserIsMember'

builder.queryField('usersForProjectAdminQueryField', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['User'],
    description: 'Returns all members from projects where the user is an admin',
    resolve: async (query, _source, _arguments, context) => {
      const isAdmin = await prisma.projectMembership.findFirst({
        where: {
          userId: context.session.user.id,
          projectRole: 'ADMIN',
        },
      })

      if (!isAdmin) {
        throw new GraphQLError('Not authorized')
      }

      const users = await prisma.user.findMany({
        ...query,
        where: {
          projectMemberships: {
            some: {
              project: getWhereUserIsMember(context.session.user.id, true),
            },
          },
        },
      })
      return users
    },
  }),
)
