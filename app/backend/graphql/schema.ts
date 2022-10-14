import { builder } from './builder'
import './team'
import './project'
import './scalars'
import './customer'
import './user'
import './task'
import './projectMembership'
import './workHour'
import './report'
import { lexicographicSortSchema, printSchema } from 'graphql'
import { writeFileSync } from 'fs'
import path from 'path'
import { resolveConfig, format } from 'prettier'

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
