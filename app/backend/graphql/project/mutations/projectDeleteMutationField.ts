import { idArg, mutationField } from 'nexus'
import { Project } from '..'
import { isAdminByProjectId } from '../../isAdminByProjectId'

export const projectDeleteMutationField = mutationField('projectDelete', {
  type: Project,
  description: 'Delete a project',
  args: {
    id: idArg({ description: 'id of the project' }),
  },
  authorize: async (_source, _arguments, context) => isAdminByProjectId(Number.parseInt(_arguments.id), context),
  resolve: (_source, { id }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    return context.prisma.project.delete({ where: { id: Number.parseInt(id) } })
  },
})
