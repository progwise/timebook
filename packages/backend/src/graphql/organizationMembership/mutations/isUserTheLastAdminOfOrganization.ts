import { prisma } from '../../prisma'

export const isUserTheLastAdminOfOrganization = async (userId: string, organizationId: string) => {
  const numberOfAdminsOfOrganization = await prisma.organizationMembership.count({
    where: { organizationId: organizationId.toString(), role: 'ADMIN' },
  })

  if (numberOfAdminsOfOrganization > 1) {
    return false
  }

  const currentMembership = await prisma.organizationMembership.findUnique({
    select: { role: true },
    where: { userId_organizationId: { organizationId: organizationId.toString(), userId: userId.toString() } },
  })

  return currentMembership?.role === 'ADMIN'
}
