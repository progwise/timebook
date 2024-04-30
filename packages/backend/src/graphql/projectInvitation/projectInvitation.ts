import { builder } from '../builder'

export const ProjectInvitation = builder.prismaObject('ProjectInvitation', {
  fields: (t) => ({
    id: t.exposeID('id'),
    project: t.relation('project'),
    expireDate: t.expose('expireDate', { type: 'DateTime' }),
    invitationKey: t.exposeString('invitationKey'),
  }),
})
