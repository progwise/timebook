import { idArg, queryField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { Customer } from '../customer'

export const customerQueryField = queryField('customer', {
  type: Customer,
  description: 'Returns a single customer',
  args: {
    customerId: idArg({ description: 'Id of the customer' }),
  },
  authorize: async (_source, { customerId }, context) => {
    const customer = await context.prisma.customer.findUnique({ where: { id: customerId }, rejectOnNotFound: true })
    return isTeamMember({ id: customer.teamId }, context)
  },
  resolve: (_source, { customerId }, context) =>
    context.prisma.customer.findUnique({ where: { id: customerId }, rejectOnNotFound: true }),
})
