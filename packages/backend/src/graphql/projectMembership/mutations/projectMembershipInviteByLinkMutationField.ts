import { builder } from "../../builder"
import { prisma } from '../../prisma'

builder.mutationField('joinProjectByInviteKey', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Add a user to a project using the invite key.',
    args: {
      inviteKey: t.arg.string(),
    },
    resolve: async (query, _source, { inviteKey }) => {
      // Find the project using the invite key
      const project = await prisma.project.findUnique({
        where: { inviteKey },
      })

      if (!project) {
        throw new Error('Invalid invite key')
      }

      //TODO: Get the current user's ID. 
      const currentUserId = getCurrentUserId()

      // Add the user to the project
      const projectMembership = await prisma.projectMembership.create({
        data: {
          userId: currentUserId,
          projectId: project.id,
        },
        select: { project: query },
      })

      return projectMembership.project
    },
  }),
)





