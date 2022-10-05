import { mutationField } from 'nexus'
import { Project } from '../project'
import { ProjectInput } from '../projectInput'

export const projectCreateMutationField = mutationField('projectCreate', {
  type: Project,
  description: 'Create a new project',
  args: {
    data: ProjectInput,
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: async (_source, { data: { title, start, end, customerId } }, context) => {
    if (!context.session?.user.id || !context.teamSlug) {
      throw new Error('not authenticated')
    }

    const now = new Date()

    const customer = customerId
      ? await context.prisma.customer.findFirstOrThrow({
          where: {
            id: customerId,
            team: {
              slug: context.teamSlug,
              teamMemberships: {
                some: {
                  userId: context.session.user.id,
                },
              },
            },
          },
        })
      : undefined

    const team = await context.prisma.team.findUniqueOrThrow({ where: { slug: context.teamSlug } })

    return context.prisma.project.create({
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
})
