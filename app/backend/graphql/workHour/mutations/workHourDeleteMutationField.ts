import { idArg, mutationField } from 'nexus'
import { WorkHour } from '../workHour'

export const workHourDeleteMutationField = mutationField('workHourDelete', {
  type: WorkHour,
  description: 'Delete a work hour entry',
  args: {
    id: idArg({ description: 'id of the workHour item' }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: async (_source, { id }, context) => {
    return await context.prisma.workHour.delete({ where: { id: Number.parseInt(id, 10) } })
  },
})
