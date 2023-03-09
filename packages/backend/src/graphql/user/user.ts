import { builder } from '../builder'
import { prisma } from '../prisma'
import { DateScalar } from '../scalars/date'

export const User = builder.prismaObject('User', {
  select: { id: true },
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    image: t.exposeString('image', { nullable: true }),
    durationWorkedOnProject: t.int({
      select: { id: true },
      args: {
        projectId: t.arg.id(),
        from: t.arg({ type: DateScalar }),
        to: t.arg({ type: DateScalar, required: false }),
      },
      authScopes: (_user, { projectId }) => ({ isProjectMember: projectId.toString() }),
      resolve: async (user, { projectId, from, to }) => {
        const aggregationResult = await prisma.workHour.aggregate({
          _sum: { duration: true },
          where: {
            userId: user.id,
            task: { projectId: projectId.toString() },
            date: {
              gte: from,
              lte: to ?? from,
            },
          },
        })
        return aggregationResult._sum.duration ?? 0
      },
    }),
  }),
})
