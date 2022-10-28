/* eslint-disable unicorn/no-process-exit */

/* eslint-disable no-console */
import { PrismaClient } from '@progwise/timebook-prisma'

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
              create: {
                name: 'Seeded User 1',
                email: 'seeded.user1@timebook.progfiles.net',
                projectMemberships: {
                  create: {
                    project: {
                      create: {
                        team: { connect: { slug: 'progwise' } },
                        title: 'Project 1',
                        tasks: {
                          create: [{ title: 'Task 1' }, { title: 'Task 2' }],
                        },
                      },
                    },
                  },
                },
              },
            },
            role: 'ADMIN',
          },
          {
            user: {
              create: {
                name: 'Seeded User 2',
                email: 'seeded.user2@timebook.progfiles.net',
                projectMemberships: {
                  create: {
                    project: {
                      create: {
                        team: { connect: { slug: 'progwise' } },
                        title: 'Project 2',
                        tasks: {
                          create: [{ title: 'Task 3' }, { title: 'Task 4' }],
                        },
                      },
                    },
                  },
                },
              },
            },
            role: 'ADMIN',
          },
        ],
      },
    },
  })
}

const run = async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

run()
