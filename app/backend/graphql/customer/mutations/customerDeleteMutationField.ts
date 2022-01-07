import { idArg, mutationField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { Customer } from '../customer'

export const customerDeleteMutationField = mutationField('customerDelete', {
  type: Customer,
  description: 'Delete a customer',
  args: {
    customerId: idArg({ description: 'Id of the customer' }),
  },
  authorize: async (_source, { customerId }, context) => {
    const customer = await context.prisma.customer.findUnique({ where: { id: customerId }, rejectOnNotFound: true })
    return isTeamMember({ id: customer.teamId }, context)
  },
  resolve: (_source, { customerId }, context) => context.prisma.customer.delete({ where: { id: customerId } }),
})
