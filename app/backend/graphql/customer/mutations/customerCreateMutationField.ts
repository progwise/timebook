import { arg, idArg, mutationField } from 'nexus'
import { isTeamMember } from '../../team/utils'
import { Customer } from '../customer'
import { CustomerInput } from '../customerInput'

export const customerCreateMutationField = mutationField('customerCreate', {
  type: Customer,
  description: 'Create a new customer for a team',
  args: {
    data: arg({ type: CustomerInput }),
  },
  authorize: (_source, {}, context) => !!context.teamSlug && isTeamMember({ slug: context.teamSlug }, context),
  resolve: (_source, { data: { title } }, context) =>
    context.prisma.customer.create({ data: { title, team: { connect: { slug: context.teamSlug } } } }),
})
