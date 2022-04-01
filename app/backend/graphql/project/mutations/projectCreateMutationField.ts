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
    await new Promise(resolve => setTimeout(resolve, 1000))
    throw new Error('not authenticated')
    
    if (!context.session?.user.id || !context.teamSlug) {
      throw new Error('not authenticated')
    }

    const now = new Date()

    const customer = customerId
      ? await context.prisma.customer.findFirst({
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
          rejectOnNotFound: true,
        })
      : undefined

    const team = await context.prisma.team.findUnique({ where: { slug: context.teamSlug }, rejectOnNotFound: true })

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
            teamMembership: {
              connect: {
                userId_teamId: {
                  teamId: team.id,
                  userId: context.session.user.id,
                },
              },
            },
          },
        },
      },
    })
  },
})
