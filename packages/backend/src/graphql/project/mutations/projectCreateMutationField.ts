import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Create a new project',
    args: {
      data: t.arg({ type: ProjectInput }),
    },
    resolve: async (query, _source, { data: { title, start, end } }, context) => {
      const now = new Date()

      return prisma.project.create({
        ...query,
        data: {
          title,
          startDate: start,
          endDate: end,
          projectMemberships: {
            create: {
              inviteAcceptedAt: now,
              invitedAt: now,
              userId: context.session.user.id,
            },
          },
        },
      })
    },
  }),
)
