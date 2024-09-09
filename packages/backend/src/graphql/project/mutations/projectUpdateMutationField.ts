import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { ProjectInput } from '../projectInput'

builder.mutationField('projectUpdate', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Update a project',
    args: {
      id: t.arg.id({ description: 'id of the project' }),
      data: t.arg({ type: ProjectInput }),
    },
    authScopes: async (_source, { id, data: { organizationId } }) => {
      const project = await prisma.project.findUniqueOrThrow({ where: { id: id.toString() } })

      if (!organizationId || organizationId === project.organizationId) {
        return {
          isAdminByProject: id.toString(),
        }
      }

      return {
        $all: {
          isAdminByProject: id.toString(),
          isAdminByOrganization: organizationId,
        },
      }
    },
    resolve: async (query, _source, { id, data: { title, start, end, organizationId } }) => {
      const project = await prisma.project.update({
        ...query,
        where: { id: id.toString() },
        data: {
          title,
          startDate: start,
          endDate: end,
          organizationId,
        },
      })

      if (organizationId) {
        const projectMemberships = await prisma.projectMembership.findMany({
          where: { projectId: id.toString() },
        })

        await Promise.all(
          projectMemberships.map(async (membership) => {
            await prisma.organizationMembership.upsert({
              where: {
                userId_organizationId: {
                  userId: membership.userId,
                  organizationId,
                },
              },
              create: {
                userId: membership.userId,
                organizationId,
                role: 'MEMBER',
              },
              update: {},
            })
          }),
        )
      }

      return project
    },
  }),
)
