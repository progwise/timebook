import { ForbiddenError } from 'apollo-server-core'
import { arg, idArg, list, nullable, queryField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { WorkHour } from '../workHour'

export const workHoursQueryField = queryField('workHours', {
  type: list(WorkHour),
  description: 'Returns a list of work hours for a given time period and a list of users',
  args: {
    teamSlug: arg({ type: 'String' }),
    from: arg({ type: 'Date', description: 'Start of the time period' }),
    to: nullable(
      arg({
        type: 'Date',
        description: 'End of the time period. If not provided the from arg is used as the end.',
      }),
    ),
    userIds: nullable(
      list(
        idArg({
          description: 'List of user ids. If not provided only the work hours of the current users are returned.',
        }),
      ),
    ),
  },
  authorize: (source, _arguments, context) => !!context.teamSlug && isTeamMember({ slug: context.teamSlug }, context),
  resolve: (source, { teamSlug, from, to = from, userIds }, context) => {
    if (!context.teamSlug || !context.session) {
      throw new ForbiddenError('team not found')
    }

    return context.prisma.workHour.findMany({
      // TODO: When projects and teams are connected in the db, we should add a teamSlug condition into the where
      where: {
        task: {
          project: {
            team: {
              slug: { equals: teamSlug },
            },
          },
        },
        userId: { in: userIds ?? [context.session?.user.id] },
        date: {
          gte: from,
          lte: to,
        },
      },
    })
  },
})
