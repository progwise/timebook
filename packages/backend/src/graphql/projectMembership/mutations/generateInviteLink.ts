import { prisma } from '../../prisma'

export const generateInviteLink = async (projectId: string): Promise<string> => {
  const existingProject = await prisma.project.findUnique({ where: { id: projectId } })
  if (!existingProject) {
    throw new Error(`Project with ID ${projectId} not found`)
  }

  return existingProject.inviteLink
}
