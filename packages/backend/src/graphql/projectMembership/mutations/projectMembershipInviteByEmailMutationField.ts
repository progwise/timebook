import { builder } from '../../builder'
import { prisma } from '../../prisma'

class UserNotFoundError extends Error {
  public email

  constructor(email: string) {
    super(`User not found with email "${email}"`)
    this.email = email
  }
}

builder.objectType(UserNotFoundError, {
  name: 'UserNotFoundError',
  fields: (t) => ({
    email: t.exposeString('email'),
  }),
})

builder.mutationField('projectMembershipInviteByEmail', (t) =>
  t.prismaField({
    errors: {
      types: [UserNotFoundError],
    },

    type: 'Project',
    description: 'Assign user to a project by e-mail.',
    args: {
      email: t.arg.string(),
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    resolve: async (query, _source, { email, projectId }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        throw new UserNotFoundError(email)
      }
      const userId = user.id

      const existingMembership = await prisma.projectMembership.findUnique({
        where: {
          userId_projectId: { userId, projectId: projectId.toString() },
        },
      })

      if (existingMembership) {
        throw new Error(`User is already a member of the project`)
      }

      const projectMembership = await prisma.projectMembership.create({
        data: {
          userId,
          projectId: projectId.toString(),
        },
        select: { project: query },
      })

      return projectMembership.project
    },
  }),
)
