import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'
import { ProjectFilter, ProjectFilterEnum } from '../projectsFilterEnum'
import { getWhereFromProjectFilter } from './getWhereFormProjectFilter'

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
    },
    resolve: (query, _source, { from, to, filter, includeProjectsWhereUserBookedWorkHours }, context) =>
      prisma.project.findMany({
        ...query,
        where: includeProjectsWhereUserBookedWorkHours
          ? {
              ...getWhereFromProjectFilter(filter, from, to ?? from),
              OR: [
                // get projects where user is member
                {
                  projectMemberships: {
                    some: {
                      userId: context.session.user.id,
                    },
                  },
                },
                // or get projects where user booked work hours
                {
                  tasks: {
                    some: {
                      workHours: {
                        some: {
                          userId: context.session.user.id,
                          AND: [{ date: { gte: from } }, { date: { lte: to ?? from } }],
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {
              ...getWhereFromProjectFilter(filter, from, to ?? from),
              projectMemberships: {
                some: {
                  userId: context.session.user.id,
                },
              },
            },
        orderBy: { title: 'asc' },
      }),
  }),
)
