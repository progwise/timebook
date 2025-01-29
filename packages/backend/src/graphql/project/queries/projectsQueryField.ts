import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'
import { ProjectFilter, ProjectFilterEnum } from '../projectsFilterEnum'
import { getWhereFromProjectFilter } from './getWhereFormProjectFilter'
import { getWhereUsersAreMembers } from './getWhereUserIsMember'

builder.queryField('projects', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Project'],
    description: 'Returns all project of the signed in user that are active',
    args: {
      from: t.arg({ type: DateScalar, required: true }),
      to: t.arg({ type: DateScalar, required: false }),
      filter: t.arg({ type: ProjectFilterEnum, defaultValue: ProjectFilter.ACTIVE }),
      includeProjectsWhereUserBookedWorkHours: t.arg.boolean({
        defaultValue: false,
        description:
          'If true, projects where the user is no longer a project member but booked work hours in the given time frame are included.',
      }),
      userIds: t.arg.idList({
        required: false,
        description: 'List of user ids. If not provided only the projects of the current users are returned.',
      }),
    },
    resolve: (query, _source, { from, to, filter, includeProjectsWhereUserBookedWorkHours, userIds }, context) => {
      // session userId not included in order to additionally query the projects where the user is only a member
      const showProjectsForOtherUser = !!(userIds?.length && !userIds.includes(context.session.user.id))
      const userIdFilter = userIds?.map((id) => id.toString()) ?? [context.session.user.id]

      return prisma.project.findMany({
        ...query,
        where: includeProjectsWhereUserBookedWorkHours
          ? {
              OR: [
                // get projects where user is member
                {
                  AND: [
                    getWhereFromProjectFilter(filter, from, to ?? from),
                    // check if the signed in user is allowed to see the projects
                    getWhereUsersAreMembers({
                      userIds: [context.session.user.id],
                      // when signed in user requests projects for another user, the signed in user must be an admin
                      isAdmin: showProjectsForOtherUser,
                    }),
                    // check if the given user is allowed to see the projects
                    showProjectsForOtherUser ? getWhereUsersAreMembers({ userIds: userIds.map(String) }) : {},
                  ],
                },
                // or get projects where user booked work hours
                {
                  ...(showProjectsForOtherUser
                    ? getWhereUsersAreMembers({ userIds: [context.session.user.id], isAdmin: true })
                    : {}),
                  tasks: {
                    some: {
                      workHours: {
                        some: {
                          userId: { in: userIdFilter },
                          AND: [{ date: { gte: from } }, { date: { lte: to ?? from } }],
                          OR: [
                            { duration: { gt: 0 } },
                            {
                              AND: [
                                // eslint-disable-next-line unicorn/no-null
                                { comment: { not: null } },
                                { comment: { not: '' } },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {
              AND: [
                getWhereFromProjectFilter(filter, from, to ?? from),
                // check if the signed in user is allowed to see the project
                getWhereUsersAreMembers({
                  userIds: [context.session.user.id],
                  // when signed in user requests projects for another user, the signed in user must be an admin
                  isAdmin: showProjectsForOtherUser,
                }),
                // check if the given user is allowed to see the projects
                showProjectsForOtherUser ? getWhereUsersAreMembers({ userIds: userIds.map(String) }) : {},
              ],
            },
        orderBy: { title: 'asc' },
      })
    },
  }),
)
