import * as digitalocean from '@pulumi/digitalocean'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../../apps/web/.env' })

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
          { key: 'NEXTAUTH_URL', value: '${APP_URL}' },
          { key: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET, type: 'SECRET' },
          { key: 'GITHUB_CLIENT_ID', value: process.env.GITHUB_CLIENT_ID },
          { key: 'GITHUB_CLIENT_SECRET', value: process.env.GITHUB_CLIENT_SECRET, type: 'SECRET' },
          { key: 'DATABASE_URL', value: '${db.DATABASE_URL}' },
        ],
      },
    ],
    databases: [
      {
        engine: 'PG',
        name: 'db',
        production: true,
        clusterName: 'app-cd9ae4c8-1b61-4e14-9369-f40e3d451169-do-user-11571250-0.b.db.ondigitalocean.com',
      },
    ],
  },
})
