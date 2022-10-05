import { mutationField } from 'nexus'
import { Team } from '../team'
import { TeamInput } from '../teamInput'

const MAX_NUMBER_OF_TEAMS = 10

export const teamCreateMutationField = mutationField('teamCreate', {
  type: Team,
  description: 'Create a new team',
  args: {
    data: TeamInput,
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: async (_source, { data: { title, slug, theme } }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
    }

    //How many teams does the user have?
    const userTeamCount = await context.prisma.teamMembership.count({
      where: {
        userId: context.session.user.id,
      },
    })

    //User should not exceed 10 teams
    if (userTeamCount >= MAX_NUMBER_OF_TEAMS) {
      throw new Error('Too many teams')
    }

    //Available team slug
    const team = await context.prisma.team.findUnique({
      where: { slug },
    })

    //Is the team slug already taken?
    if (team) {
      throw new Error('Team slug already taken')
    }

    return context.prisma.team.create({
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
})
