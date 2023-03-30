/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable unicorn/prefer-module */
import { execSync } from 'child_process'
import { TestEnvironment } from 'jest-environment-node'
import { nanoid } from 'nanoid'
import path from 'path'
import Postgres from 'pg'

const prismaBinary = path.join('./node_modules/.bin/', 'prisma2')

class PrismaTestEnvironment extends TestEnvironment {
  constructor(config) {
    super(config)

    // Generate a unique schema identifier for this test context
    this.schema = `test_${nanoid()}`

    // Generate the pg connection string for the test schema
    this.connectionString = `postgresql://timebookdbuser:Test123@localhost:5432/timebookdb?schema=${this.schema}&connect_timeout=15`
  }

  async setup() {
    // Set the required environment variable to contain the connection string
    // to our database test schema
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    // Run the migrations to ensure our schema has the required structure
    try {
      execSync(`${prismaBinary} migrate deploy`)
    } catch {
      // eslint-disable-next-line no-console
      console.warn('migrate error for 1st try')
      execSync(`${prismaBinary} migrate deploy`)
    }

    return super.setup()
  }

  async teardown() {
    // Drop the schema after the tests have completed
    const client = new Postgres.Client({
      connectionString: this.connectionString,
    })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}

export default PrismaTestEnvironment
