import { builder } from '../builder'

class ModifyInterfaceHelper {}

export const ModifyInterface = builder.interfaceType(ModifyInterfaceHelper, {
  name: 'ModifyInterface',
  description: 'Adds the information whether the user can edit the entity',
  fields: (t) => ({
    canModify: t.boolean({ description: 'Can the user modify the entity' }),
  }),
})
