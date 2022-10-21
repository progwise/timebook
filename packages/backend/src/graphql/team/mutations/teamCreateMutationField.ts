import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { TeamInput } from '../teamInput'

const MAX_NUMBER_OF_TEAMS = 10

builder.mutationField('teamCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Team',
    description: 'Create a new team',
    args: {
      data: t.arg({ type: TeamInput }),
    },
    resolve: async (query, _source, { data: { title, slug, theme } }, context) => {
      //How many teams does the user have?
      const userTeamCount = await prisma.teamMembership.count({
        where: {
          userId: context.session.user.id,
        },
      })

      //User should not exceed 10 teams
      if (userTeamCount >= MAX_NUMBER_OF_TEAMS) {
        throw new Error('Too many teams')
      }

      //Available team slug
      const team = await prisma.team.findUnique({
        where: { slug },
      })

      //Is the team slug already taken?
      if (team) {
        throw new Error('Team slug already taken')
      }

      return prisma.team.create({
        ...query,
        data: {
          title,
          slug,
          theme: theme ?? undefined,
          teamMemberships: {
            create: {
              userId: context.session.user.id,
              role: 'ADMIN',
            },
          },
        },
      })
    },
  }),
)
