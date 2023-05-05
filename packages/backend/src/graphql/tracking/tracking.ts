import { builder } from '../builder'
import { DateTimeScalar } from '../scalars'

export const Tracking = builder.prismaObject('Tracking', {
  fields: (t) => ({
    task: t.relation('task'),
    start: t.expose('start', { type: DateTimeScalar }),
  }),
})
