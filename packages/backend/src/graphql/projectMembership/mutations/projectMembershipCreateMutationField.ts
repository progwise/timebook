import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { RoleEnum } from '../../user/role'
import { isUserTheLastAdminOfProject } from './isUserTheLastAdminOfProject'

builder.mutationField('projectMembershipCreate', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Assign user to a project. This mutation can also be used for updating the role of a project member',
    args: {
      userId: t.arg.id(),
      projectId: t.arg.id(),
      role: t.arg({ type: RoleEnum, defaultValue: 'MEMBER' }),
    },
    authScopes: (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    resolve: async (query, _source, { userId, projectId, role }) => {
      if (role === 'MEMBER' && (await isUserTheLastAdminOfProject(userId.toString(), projectId.toString()))) {
        throw new Error('Membership can not be changed because user is the last admin')
      }

      const projectMembership = await prisma.projectMembership.upsert({
        select: { project: query },
        where: { userId_projectId: { userId: userId.toString(), projectId: projectId.toString() } },
        create: {
          userId: userId.toString(),
          projectId: projectId.toString(),
          role: role,
        },
        update: { role },
      })

      return projectMembership.project
    },
  }),
)
