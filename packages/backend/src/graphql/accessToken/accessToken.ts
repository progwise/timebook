import { builder } from '../builder'
import { DateTimeScalar } from '../scalars'

export const AccessToken = builder.prismaObject('AccessToken', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: DateTimeScalar, description: 'Date when the access token was created' }),
    name: t.exposeString('name'),
  }),
})
