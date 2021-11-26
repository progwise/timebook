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
  resolve: (_source, { data: { title, start, end } }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    const now = new Date()

    return context.prisma.project.create({
      data: {
        title,
        startDate: start,
        endDate: end,
        projectMemberships: {
          create: {
            userId: context.session.user.id,
            role: 'ADMIN',
            inviteAcceptedAt: now,
            invitedAt: now,
          },
        },
      },
    })
  },
})
