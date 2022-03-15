import { GraphQLError } from 'graphql'
import { objectType } from 'nexus'
import { Project } from '../project'
import { Role } from './role'

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id')
    t.nullable.string('name')
    t.nullable.string('image')
    t.list.field('projects', {
      type: Project,
      description: 'Returns the list of projects where the user is a member',
      resolve: (user, _arguments, context) => {
        if (!context.teamSlug) {
          return []
        }
        return context.prisma.project.findMany({
          where: {
            team: {
              slug: context.teamSlug,
            },
            projectMemberships: {
              some: {
                teamMembership: {
                  team: { slug: context.teamSlug },
                  userId: user.id,
                },
              },
            },
          },
        })
      },
    })
    t.field('role', {
      type: Role,
      description: 'Role of the user in the current team',
      resolve: async (user, _arguments, context) => {
        const slug = context.teamSlug

        if (!slug) {
          throw new GraphQLError('Team slug is missing.')
        }

        const membership = await context.prisma.teamMembership.findFirst({
          where: {
            userId: user.id,
            team: { slug },
          },
          rejectOnNotFound: true,
        })

        return membership.role
      },
    })
  },
})
