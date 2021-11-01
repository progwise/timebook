/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */

import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        name: 'Seeded User 1',
        email: 'seeded.user1@timebook.progfiles.net',
        memberships: {
            create: [
                { project: { create: { title: 'Seeded Project 1' } } },
                { project: { create: { title: 'Seeded Project 2' } } },
            ],
        },
    },
    {
        name: 'Seeded User 2',
        email: 'seeded.user2@timebook.progfiles.net',
        memberships: {
            create: [
                { project: { create: { title: 'Seeded Project 3' } } },
                { project: { create: { title: 'Seeded Project 4' } } },
            ],
        },
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
