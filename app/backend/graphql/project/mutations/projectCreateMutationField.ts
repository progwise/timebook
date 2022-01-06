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
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    const now = new Date()

    const customer = await context.prisma.customer.findFirst({
      where: {
        id: customerId,
        team: {
          teamMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
      },
      rejectOnNotFound: true,
    })

    return context.prisma.project.create({
      data: {
        title,
        startDate: start,
        endDate: end,
        customerId,
        projectMemberships: {
          create: {
            role: 'ADMIN',
            inviteAcceptedAt: now,
            invitedAt: now,
            teamMembership: {
              connect: {
                userId_teamId: {
                  teamId: customer.teamId,
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
