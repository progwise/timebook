import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

// builder.mutationField('projectCreate', (t) =>
//   t.withAuth({ isLoggedIn: true }).prismaField({
//     type: 'Project',
//     description: 'Create a new project',
//     args: {
//       data: t.arg({ type: ProjectInput }),
//     },
//     resolve: async (query, _source, { data: { title, start, end } }, context) => {
//       const now = new Date()

//       return prisma.project.create({
//         ...query,
//         data: {
//           title,
//           startDate: start,
//           endDate: end,
//           projectMemberships: {
//             create: {
//               inviteAcceptedAt: now,
//               invitedAt: now,
//               userId: context.session.user.id,
//               role: 'ADMIN',
//             },
//           },
//         },
//       })
//     },
//   }),
// )

builder.mutationField('projectInvitation', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    authScopes: async (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    args: {
      projectId: t.arg.id(),
    },
    resolve: async (query, _source, { projectId }) => {
      const updatedProject = await prisma.project.update({
        ...query,
        where: {
          id: projectId.toString(),
        },
        data: {
          inviteKey: crypto.randomUUID(),
        },
      })
      return updatedProject
    },
  }),
)
