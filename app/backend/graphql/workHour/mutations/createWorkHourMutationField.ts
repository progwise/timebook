import { arg, floatArg, idArg, mutationField, nullable, stringArg } from 'nexus'
import { WorkHour } from '..'
import { DateScalar } from '../../scalars/date'

export const createWorkHourMutationField = mutationField('createWorkHour', {
    type: WorkHour,
    description: 'Create a new WorkHour',
    args: {
        hours: floatArg(),
        projectId: idArg(),
        date: arg({ type: DateScalar }),
        comment: nullable(stringArg()),
    },
    authorize: (_source, _arguments, context) => !!context.session?.user.id,
    resolve: (_source, arguments_, context) => {
        if (!context.session?.user.id) {
            throw new Error('unauthenticated')
        }

        return context.prisma.workHour.create({
            data: {
                date: new Date(arguments_.date),
                hours: arguments_.hours,
                projectId: Number.parseInt(arguments_.projectId),
                userId: context.session.user.id,
                comment: arguments_.comment,
            },
        })
    },
})
