import path from 'path'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import {
  projectsQueryField,
  projectQueryField,
  projectCreateMutationField,
  projectDeleteMutationField,
  projectUpdateMutationField,
} from './project'
import { createWorkHourMutationField } from './workHour'
import { DateScalar, TimeScalar } from './scalars'
import { taskCreateMutationField, taskDeleteMutationField } from './task'
import { usersQeryField, userQueryField } from './user'

export const schema = makeSchema({
  types: [
    createWorkHourMutationField,
    projectsQueryField,
    projectQueryField,
    DateScalar,
    TimeScalar,
    projectCreateMutationField,
    projectDeleteMutationField,
    projectUpdateMutationField,
    taskCreateMutationField,
    taskDeleteMutationField,
    userQueryField,
    usersQeryField,
  ],
  outputs: {
    typegen: path.join(process.env.ROOT ?? '', '/backend/graphql/generated', 'nexus-typegen.ts'),
    schema: path.join(process.env.ROOT ?? '', '/backend/graphql/generated', 'schema.graphql'),
  },
  prettierConfig: path.join(process.env.ROOT ?? '', './.prettierrc.js'),
  contextType: {
    module: path.join(process.env.ROOT ?? '', '/backend/graphql', 'context.ts'),
    export: 'Context',
  },
  nonNullDefaults: { input: true, output: true },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
    mapping: {
      Project: 'prisma.Project',
      WorkHour: 'prisma.WorkHour',
      Task: 'prisma.Task',
    },
  },
  plugins: [fieldAuthorizePlugin()],
})
