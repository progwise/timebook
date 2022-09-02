/* eslint-disable unicorn/no-useless-undefined */
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'
import { Environment, EnvironmentReturn } from 'vitest'
import { nanoid } from 'nanoid'
import { Client } from 'pg'

const execPromise = promisify(exec)

const prismaBinary = path.join('./node_modules/.bin/', 'prisma2')

// Right now it is not possible to use custom environments in vitest
// Therefore, here is a hack to use a custom environment by importing it in a test

const PrismaVitestEnvironment: Environment = {
  name: 'PrismaVitestEnvironment',
  setup: async () => {
    // Generate a unique schema identifier for this test context
    const schema = `test_${nanoid()}`

    // Generate the pg connection string for the test schema
    const connectionString = `postgresql://timebookdbuser:Test123@localhost:5432/timebookdb?schema=${schema}`

    process.env.DATABASE_URL = connectionString
    // global.process.env.DATABASE_URL = connectionString

    await execPromise(`${prismaBinary} migrate deploy`)

    return {
      teardown: async () => {
        const client = new Client({
          connectionString: connectionString,
        })
        await client.connect()
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await client.end()

        // delete global.process.env.DATABASE_URL
      },
    }
  },
}

let environment: EnvironmentReturn

beforeAll(async () => {
  environment = await PrismaVitestEnvironment.setup(undefined, {})
})

afterAll(async () => {
  await environment.teardown(undefined)
})
