/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectUnarchive', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Unarchive a project',
    args: {
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    resolve: async (query, _source, arguments_) => {
      const projectId = arguments_.projectId.toString()
      const project = await prisma.project.findUnique({
        select: { archivedAt: true },
        where: { id: projectId },
      })

      if (!project) {
        throw new Error('Project not found')
      }

      if (project.archivedAt === null) {
        return prisma.project.findUniqueOrThrow({ ...query, where: { id: projectId } })
      }

      return prisma.project.update({
        ...query,
        where: { id: projectId },
        data: { archivedAt: null },
      })
    },
  }),
)
