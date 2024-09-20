import { prisma } from '../../prisma'

export const isUserTheLastAdminOfOrganization = async (userId: string, organizationId: string) => {
  const numberOfAdminsOfOrganization = await prisma.organizationMembership.count({
    where: { organizationId: organizationId.toString(), organizationRole: 'ADMIN' },
  })

  if (numberOfAdminsOfOrganization > 1) {
    return false
  }

  const currentMembership = await prisma.organizationMembership.findUnique({
    select: { organizationRole: true },
    where: { userId_organizationId: { organizationId: organizationId.toString(), userId: userId.toString() } },
  })

  return currentMembership?.organizationRole === 'ADMIN'
}
