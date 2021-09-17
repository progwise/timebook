import { floatArg, idArg, mutationField, nullable, stringArg } from 'nexus'
import { WorkHour } from '..'

export const createWorkHourMutationField = mutationField('createWorkHour', {
    type: WorkHour,
    description: 'Create a new WorkHour',
    args: {
        hours: floatArg(),
        projectId: idArg(),
        userId: idArg(),
        date: stringArg(),
        comment: nullable(stringArg()),
    },
    resolve: (_source, arguments_, context) =>
        context.prisma.workHour.create({
            data: {
                date: new Date(arguments_.date),
                hours: arguments_.hours,
                projectId: Number.parseInt(arguments_.projectId),
                userId: Number.parseInt(arguments_.userId),
                comment: arguments_.comment,
            },
        }),
})
