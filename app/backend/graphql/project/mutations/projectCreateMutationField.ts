import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectCreate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Project',
    description: 'Create a new project',
    args: {
      data: t.arg({ type: ProjectInput }),
    },
    resolve: async (query, _source, { data: { title, start, end, customerId } }, context) => {
      const now = new Date()

      const customer = customerId
        ? await prisma.customer.findFirstOrThrow({
            where: {
              id: customerId.toString(),
              team: { slug: context.teamSlug },
            },
          })
        : undefined

      const team = await prisma.team.findUniqueOrThrow({ where: { slug: context.teamSlug } })

      return prisma.project.create({
        ...query,
        data: {
          title,
          startDate: start,
          endDate: end,
          customerId: customer?.id,
          teamId: team.id,
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
