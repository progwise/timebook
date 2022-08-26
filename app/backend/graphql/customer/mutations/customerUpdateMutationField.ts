import { arg, idArg, mutationField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { Customer } from '../customer'
import { CustomerInput } from '../customerInput'

export const customerUpdateMutationField = mutationField('customerUpdate', {
  type: Customer,
  description: 'Update a customer',
  args: {
    customerId: idArg({ description: 'Id of the customer' }),
    data: arg({ type: CustomerInput }),
  },
  authorize: async (_source, { customerId }, context) => {
    const customer = await context.prisma.customer.findUniqueOrThrow({ where: { id: customerId } })
    return isTeamMember({ id: customer.teamId }, context)
  },
  resolve: (_source, { customerId, data }, context) =>
    context.prisma.customer.update({
      where: { id: customerId },
      data,
    }),
})
