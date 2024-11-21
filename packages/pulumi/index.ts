import * as digitalocean from '@pulumi/digitalocean'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../../apps/web/.env' })

const timebook_cluster = new digitalocean.DatabaseCluster(
  'timebook-cluster',
  {
    engine: 'pg',
    name: 'app-cd9ae4c8-1b61-4e14-9369-f40e3d451169',
    nodeCount: 1,
    region: 'fra1',
    size: 'db-s-1vcpu-1gb',
    version: '12',
  },
  {
    protect: true,
  },
)

const timebook_database = new digitalocean.DatabaseDb(
  'db',
  {
    clusterId: timebook_cluster.id,
    name: 'db',
  },
  {
    protect: true,
  },
)
const database_user = new digitalocean.DatabaseUser(
  'db',
  {
    clusterId: timebook_cluster.id,
    name: 'db',
  },
  {
    protect: true,
  },
)

export const timebook = new digitalocean.App('timebook', {
  spec: {
    domainNames: [{ name: 'timebook.progwise.net' }],
    name: 'timebook',
    region: 'fra1',
    services: [
      {
        git: {
          branch: 'main',
          repoCloneUrl: 'https://github.com/progwise/timebook',
        },
        instanceCount: 1,
        name: 'timebook',
        instanceSizeSlug: 'basic-xxs',
        dockerfilePath: 'Dockerfile',
        envs: [
          { key: 'NEXT_PUBLIC_APP_URL', value: '${APP_URL}' },
          { key: 'NEXTAUTH_URL', value: '${APP_URL}' },
          { key: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET, type: 'SECRET' },
          { key: 'GITHUB_CLIENT_ID', value: process.env.GITHUB_CLIENT_ID },
          { key: 'GITHUB_CLIENT_SECRET', value: process.env.GITHUB_CLIENT_SECRET, type: 'SECRET' },
          { key: 'DATABASE_URL', value: '${db.DATABASE_URL}' },
          { key: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', value: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID },
          { key: 'PAYPAL_CLIENT_SECRET', value: process.env.PAYPAL_CLIENT_SECRET, type: 'SECRET' },
          { key: 'PAYPAL_URL', value: process.env.PAYPAL_URL },
        ],
      },
    ],
    databases: [
      {
        engine: 'PG',
        name: 'db',
        production: true,
        clusterName: timebook_cluster.name,
        dbName: timebook_database.name,
        dbUser: database_user.name,
      },
    ],
  },
})
