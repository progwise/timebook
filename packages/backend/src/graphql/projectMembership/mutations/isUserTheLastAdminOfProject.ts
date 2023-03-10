import { prisma } from '../../prisma'

export const isUserTheLastAdminOfProject = async (userId: string, projectId: string) => {
  const numberOfAdminsOfProject = await prisma.projectMembership.count({
    where: { projectId: projectId.toString(), role: 'ADMIN' },
  })

  if (numberOfAdminsOfProject > 1) {
    return false
  }

  const currentMembership = await prisma.projectMembership.findUnique({
    select: { role: true },
    where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
  })

  return currentMembership?.role === 'ADMIN'
}
