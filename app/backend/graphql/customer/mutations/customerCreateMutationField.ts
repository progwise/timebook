import { arg, idArg, mutationField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { Customer } from '../customer'
import { CustomerInput } from '../customerInput'

export const customerCreateMutationField = mutationField('customerCreate', {
  type: Customer,
  description: 'Create a new customer for a team',
  args: {
    teamId: idArg({ description: 'Id of the team' }),
    data: arg({ type: CustomerInput }),
  },
  authorize: (_source, { teamId }, context) => isTeamMember({ id: teamId }, context),
  resolve: (_source, { teamId, data: { title } }, context) =>
    context.prisma.customer.create({ data: { teamId, title } }),
})
