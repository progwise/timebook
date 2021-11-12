import { idArg, mutationField } from 'nexus'
import { Project } from '..'
import { ProjectInput } from '../projectInput'
import { isUserAdminMember } from './isUserAdminMember'

export const projectUpdateMutationField = mutationField('projectUpdate', {
  type: Project,
  description: 'Update a project',
  args: {
    id: idArg({ description: 'id of the project' }),
    data: ProjectInput,
  },
  authorize: async (_source, _arguments, context) => isUserAdminMember(_arguments.id, context),
  resolve: (_source, { id, data: { title, start, end } }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    return context.prisma.project.update({
      where: { id: Number.parseInt(id) },
      data: {
        title,
        startDate: start,
        endDate: end,
      },
    })
  },
})
