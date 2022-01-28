import { arg, mutationField } from 'nexus'
import { Team } from '../team'
import { TeamInput } from '../teamInput'

export const teamCreateMutationField = mutationField('teamCreate', {
  type: Team,
  description: 'Create a new team',
  args: {
    data: arg({ type: TeamInput }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, { data: { title, slug, theme } }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
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
