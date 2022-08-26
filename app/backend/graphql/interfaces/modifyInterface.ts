import { AuthenticationError } from 'apollo-server-core'
import { GraphQLError } from 'graphql'
import { interfaceType } from 'nexus'

export const ModifyInterface = interfaceType({
  name: 'ModifyInterface',
  description: 'Adds the information whether the user can edit the entity',
  definition: (t) => {
    t.boolean('canModify', {
      description: 'Can the user modify the entity',
      resolve: async (source, _arguments, context) => {
        if (!context.session) {
          throw new AuthenticationError('not authorized')
        }

        if (!context.teamSlug) {
          throw new GraphQLError('team slug not found', {})
        }

        const membership = await context.prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: context.session.user.id,
            team: { slug: context.teamSlug },
          },
        })

        return membership.role === 'ADMIN'
      },
    })
  },
  // eslint-disable-next-line unicorn/no-null
  resolveType: () => null,
})
