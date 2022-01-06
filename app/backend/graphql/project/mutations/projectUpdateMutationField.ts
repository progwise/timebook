import { idArg, mutationField } from 'nexus'
import { Project } from '../project'
import { ProjectInput } from '../projectInput'
import { isAdminByProjectId } from '../../isAdminByProjectId'

export const projectUpdateMutationField = mutationField('projectUpdate', {
  type: Project,
  description: 'Update a project',
  args: {
    id: idArg({ description: 'id of the project' }),
    data: ProjectInput,
  },
  authorize: async (_source, _arguments, context) => isAdminByProjectId(Number.parseInt(_arguments.id), context),
  resolve: async (_source, { id, data: { title, start, end, customerId } }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    const currentCustomer = (
      await context.prisma.project.findUnique({
        where: { id: Number.parseInt(id) },
        rejectOnNotFound: true,
        include: { customer: true },
      })
    ).customer

    const newCustomer = await context.prisma.customer.findFirst({
      where: {
        id: customerId,
        team: {
          id: currentCustomer.teamId, // it is not possible to move a customer to a new team
          teamMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
      },
      rejectOnNotFound: true,
    })

    return context.prisma.project.update({
      where: { id: Number.parseInt(id) },
      data: {
        title,
        startDate: start,
        endDate: end,
        customerId: newCustomer.id,
      },
    })
  },
})
