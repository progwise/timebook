import { writeFileSync } from 'fs'
import { lexicographicSortSchema, printSchema } from 'graphql'
import path from 'path'
import { resolveConfig, format } from 'prettier'

import { builder } from './builder'
import './customer'
import './project'
import './projectMembership'
import './report'
import './scalars'
import './task'
import './team'
import './user'
import './workHour'

export const schema = builder.toSchema()

const printGraphQLSchema = async () => {
  const rootPath = process.env.ROOT

  if (!rootPath) {
    throw new Error('Root path not defined')
  }

  const config = await resolveConfig(path.join(rootPath, './prettierrc.js'))

  const schemaAsString = format(printSchema(lexicographicSortSchema(schema)), {
    parser: 'graphql',
    ...config,
  })
  writeFileSync(path.join(rootPath, './backend/graphql/generated/schema.graphql'), schemaAsString)
}

if (process.env.NODE_ENV === 'development') {
  printGraphQLSchema()
}
