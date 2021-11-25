import { idArg, mutationField } from 'nexus'
import { Project } from '../project'
import { ProjectInput } from '../projectInput'
import { isAdminByProjectId } from '../../isAdminByProjectId'

export const projectUpdateMutationField = mutationField('projectUpdate', {
  type: Project,
  description: 'Update a project',
  args: {
    id: idArg({ description: 'id of the project' }),
    data: ProjectInput,
  },
  authorize: async (_source, _arguments, context) => isAdminByProjectId(Number.parseInt(_arguments.id), context),
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
