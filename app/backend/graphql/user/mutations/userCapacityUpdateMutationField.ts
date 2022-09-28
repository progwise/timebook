import { floatArg, idArg, mutationField } from 'nexus'
import { User } from '../user'
import { isTeamAdmin } from '../../isTeamAdmin'

export const userCapacityUpdateMutationField = mutationField('userCapacityUpdate', {
  type: User,
  description: 'Updated a user capacity hours',
  args: {
    userId: idArg({ description: 'Id of the user' }),
    capacityHours: floatArg({ description: 'Capacity of hours' }),
  },
  authorize: async (_source, {}, context) => isTeamAdmin(context),
  resolve: async (_source, { userId, capacityHours }, context) => {
    const user = await context.prisma.user.update({ data: { capacityHours }, where: { id: userId } })
    return user
  },
})
