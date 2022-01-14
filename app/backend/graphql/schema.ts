import path from 'path'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import {
  projectsQueryField,
  projectQueryField,
  projectCreateMutationField,
  projectDeleteMutationField,
  projectUpdateMutationField,
} from './project'
import { createWorkHourMutationField, workHoursQueryField } from './workHour'
import { DateScalar, TimeScalar } from './scalars'
import { taskArchiveMutationField, taskCreateMutationField, taskDeleteMutationField } from './task'
import { usersQueryField, userQueryField } from './user'
import {
  teamAcceptInviteMutationField,
  teamBySlugQueryField,
  teamCreateMutationField,
  teamDeleteMutationField,
  teamQueryField,
  teamsQueryField,
  teamUpdateMutationField,
} from './team'
import {
  customerCreateMutationField,
  customerDeleteMutationField,
  customerQueryField,
  customerUpdateMutationField,
} from './customer'

export const schema = makeSchema({
  types: [
    workHoursQueryField,
    createWorkHourMutationField,
    projectsQueryField,
    projectQueryField,
    DateScalar,
    TimeScalar,
    projectCreateMutationField,
    projectDeleteMutationField,
    projectUpdateMutationField,
    taskArchiveMutationField,
    taskCreateMutationField,
    taskDeleteMutationField,
    userQueryField,
    usersQueryField,
    teamsQueryField,
    teamQueryField,
    teamBySlugQueryField,
    teamAcceptInviteMutationField,
    teamCreateMutationField,
    teamUpdateMutationField,
    teamDeleteMutationField,
    customerQueryField,
    customerCreateMutationField,
    customerDeleteMutationField,
    customerUpdateMutationField,
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
