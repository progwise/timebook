import path from 'path'
import { fieldAuthorizePlugin, floatArg, intArg, list, makeSchema, objectType, queryField } from 'nexus'
import { projectsQueryField } from './project'
import { createWorkHourMutationField } from './workHour'
import { DateScalar } from './scalars/date'
import { TimeScalar } from './scalars/time'
import { projectCreateMutationField, projectDeleteMutationField, projectUpdateMutationField } from './project/mutations'
import { taskCreateMutationField, taskDeleteMutationField } from './task'
import { projectQueryField } from './project/queries/projectQueryField'

const User = objectType({
  name: 'User',
  definition: (t) => {
    t.nullable.id('id')
    t.nullable.string('name')
    t.nullable.string('image')
  },
})

const addQueryField = queryField('add', {
  type: 'String',
  args: {
    a: floatArg(),
    b: intArg(),
  },
  resolve: (source, { a, b }) => {
    return `die Summe von ${a} und ${b} ist ${a + b}`
  },
})

const userQueryField = queryField('user', {
  type: User,
  resolve: () => {
    return {
      id: 'abc',
      name: 'Linus',
    }
  },
})

const usersQeryField = queryField('users', {
  type: list(User),
  resolve: (source, _arguments, context) => {
    return context.prisma.user.findMany()
  },
})

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
    addQueryField,
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
