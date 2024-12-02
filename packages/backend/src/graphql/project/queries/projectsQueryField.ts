import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'
import { ProjectFilter, ProjectFilterEnum } from '../projectsFilterEnum'
import { getWhereFromProjectFilter } from './getWhereFormProjectFilter'
import { getWhereUserIsMember } from './getWhereUserIsMember'

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
      projectMemberUserId: t.arg.id({
        required: false,
        description:
          'Filter projects where the given user is a project member. If not given, the projects of the signed in user are returned.',
      }),
    },
    resolve: (
      query,
      _source,
      { from, to, filter, includeProjectsWhereUserBookedWorkHours, projectMemberUserId },
      context,
    ) => {
      const showProjectsForOtherUser = !!projectMemberUserId && projectMemberUserId !== context.session.user.id

      return prisma.project.findMany({
        ...query,
        where: includeProjectsWhereUserBookedWorkHours
          ? {
              OR: [
                // get projects where user is member
                {
                  AND: [
                    getWhereFromProjectFilter(filter, from, to ?? from),
                    // check if the signed in user is allowed to see the project
                    getWhereUserIsMember(
                      context.session.user.id,
                      // when signed in user requests projects for another user, the signed in user must be an admin
                      showProjectsForOtherUser,
                    ),
                    // check if the given user is allowed to see the project
                    showProjectsForOtherUser ? getWhereUserIsMember(projectMemberUserId.toString()) : {},
                  ],
                },
                // or get projects where user booked work hours
                {
                  ...(showProjectsForOtherUser ? getWhereUserIsMember(context.session.user.id, true) : {}),
                  tasks: {
                    some: {
                      workHours: {
                        some: {
                          userId: projectMemberUserId?.toString() ?? context.session.user.id,
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
                getWhereUserIsMember(
                  context.session.user.id,
                  // when signed in user requests projects for another user, the signed in user must be an admin
                  showProjectsForOtherUser,
                ),
                // check if the given user is allowed to see the project
                showProjectsForOtherUser ? getWhereUserIsMember(projectMemberUserId.toString()) : {},
              ],
            },
        orderBy: { title: 'asc' },
      })
    },
  }),
)
