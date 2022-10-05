import { GraphQLError } from 'graphql'
import { objectType } from 'nexus'
import { Customer } from '../customer'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { Project } from '../project'
import { User } from '../user'
import { Theme } from './theme'

export const Team = objectType({
  name: 'Team',
  definition: (t) => {
    t.implements(ModifyInterface)
    t.id('id', { description: 'Identifier of the team' })
    t.string('title', { description: 'Title of the team' })
    t.string('slug', { description: 'Slug that is used in the team URL' })
    t.boolean('archived', { resolve: (team) => !!team.archivedAt })
    t.field('theme', {
      type: Theme,
      description: 'Color theme of the team',
    })
    t.string('inviteKey')
    t.list.field('members', {
      type: User,
      description: 'All members of the team',
      resolve: (team, _arguments, context) =>
        context.prisma.user.findMany({
          where: { teamMemberships: { some: { teamId: team.id } } },
        }),
    })
    t.list.field('customers', {
      type: Customer,
      description: 'List of all customers of the team',
      resolve: (team, _arguments, context) => context.prisma.customer.findMany({ where: { teamId: team.id } }),
    })
    t.list.field('projects', {
      type: Project,
      description: 'List of all projects of the team',
      resolve: (team, _arguments, context) => {
        if (!context.session?.user) {
          throw new GraphQLError('Not authorized', {})
        }
        return context.prisma.project.findMany({
          where: {
            AND: {
              teamId: team.id,
              OR: {
                projectMemberships: { some: { userId: context.session?.user.id } },
                team: { teamMemberships: { some: { role: 'ADMIN', userId: context.session?.user.id } } },
              },
            },
          },
        })
      },
    })
  },
})
