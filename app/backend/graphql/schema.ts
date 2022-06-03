import path from 'path'
import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import {
  projectsQueryField,
  projectQueryField,
  projectCreateMutationField,
  projectDeleteMutationField,
  projectUpdateMutationField,
} from './project'
import {
  workHourCreateMutationField,
  workHourUpdateMutationField,
  workHoursQueryField,
  workHourDeleteMutationField,
} from './workHour'
import { DateScalar, TimeScalar } from './scalars'
import {
  taskArchiveMutationField,
  taskCreateMutationField,
  taskDeleteMutationField,
  taskQueryField,
  taskUpdateMutationField,
} from './task'
import { usersQueryField, userQueryField, userRoleUpdateMutationField } from './user'
import {
  teamAcceptInviteMutationField,
  teamArchiveMutationField,
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
import { reportQueryField } from './report'
import { projectMembershipCreateMutationField } from './projectMembership/mutations/projectMembershipCreateMutationField'

export const schema = makeSchema({
  types: [
    workHoursQueryField,
    workHourCreateMutationField,
    workHourUpdateMutationField,
    workHourDeleteMutationField,
    projectsQueryField,
    projectQueryField,
    DateScalar,
    TimeScalar,
    projectCreateMutationField,
    projectDeleteMutationField,
    projectUpdateMutationField,
    projectMembershipCreateMutationField,
    taskQueryField,
    taskArchiveMutationField,
    taskCreateMutationField,
    taskDeleteMutationField,
    taskUpdateMutationField,
    userQueryField,
    usersQueryField,
    userRoleUpdateMutationField,
    teamsQueryField,
    teamQueryField,
    teamBySlugQueryField,
    teamAcceptInviteMutationField,
    teamArchiveMutationField,
    teamCreateMutationField,
    teamUpdateMutationField,
    teamDeleteMutationField,
    customerQueryField,
    customerCreateMutationField,
    customerDeleteMutationField,
    customerUpdateMutationField,
    reportQueryField,
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
      Team: 'prisma.Team',
      Report: 'NexusGenArgTypes["Query"]["report"]',
    },
  },
  plugins: [fieldAuthorizePlugin()],
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
})
