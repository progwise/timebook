/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.team.create({
    data: {
      title: 'Progwise',
      slug: 'progwise',
      teamMemberships: {
        create: [
          {
            user: {
              connectOrCreate: {
                where: { email: 'seeded.user1@timebook.progfiles.net' },
                create: {
                  name: 'Seeded User 1',
                  email: 'seeded.user1@timebook.progfiles.net',
                },
              },
            },
            projectMemberships: {
              create: {
                project: {
                  create: {
                    title: 'Project 1',
                    customer: {
                      create: {
                        title: 'Customer 1',
                        team: { connect: { slug: 'progwise' } },
                      },
                    },
                    tasks: {
                      create: [{ title: 'Task 1' }, { title: 'Task 2' }],
                    },
                  },
                },
              },
            },
          },
          {
            user: {
              connectOrCreate: {
                where: { email: 'seeded.user2@timebook.progfiles.net' },
                create: {
                  name: 'Seeded User 2',
                  email: 'seeded.user2@timebook.progfiles.net',
                },
              },
            },
            projectMemberships: {
              create: {
                project: {
                  create: {
                    title: 'Project 1',
                    customer: {
                      create: {
                        title: 'Customer 2',
                        team: { connect: { slug: 'progwise' } },
                      },
                    },
                    tasks: {
                      create: [{ title: 'Task 3' }, { title: 'Task 4' }],
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
