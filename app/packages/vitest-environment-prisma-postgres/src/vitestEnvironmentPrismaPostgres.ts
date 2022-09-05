import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'
import { Environment } from 'vitest'
import { nanoid } from 'nanoid'
import { Client } from 'pg'

const execPromise = promisify(exec)

const prismaBinary = path.join('./node_modules/.bin/', 'prisma2')

export const PrismaVitestEnvironment: Environment = {
  name: 'PrismaPostgresVitestEnvironment',
  setup: async () => {
    // Generate a unique schema identifier for this test context
    const schema = `test_${nanoid()}`

    // Generate the pg connection string for the test schema
    const connectionString = `postgresql://timebookdbuser:Test123@localhost:5432/timebookdb?schema=${schema}&connect_timeout=15`

    process.env.DATABASE_URL = connectionString

    await execPromise(`${prismaBinary} migrate deploy`)

    return {
      teardown: async () => {
        const client = new Client({
          connectionString: connectionString,
        })
        await client.connect()
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await client.end()

        delete process.env.DATABASE_URL
      },
    }
  },
}
