import {PrismaClient} from '@prisma/client'
import {Command} from 'commander'
import makeId from './makeId';

const prisma = new PrismaClient()
const getAllItems = async (itemTypeName: string) => {
  switch (itemTypeName.toLowerCase()) {
    case 'project':
      return await prisma.project.findMany()
    case 'user':
      return await prisma.user.findMany()
    default:
      throw new Error(`typeName ${itemTypeName} not implemented`)
  }
}

const addTestItem = async (itemTypeName: string): Promise<any> => {
  const random = makeId(5)
  switch (itemTypeName.toLowerCase()) {
    case 'project':
      return await prisma.project.create({
        data: {
          title: `Test Project ${random}`,
          authorId: 1
        }
      })
    case 'user':
      return await prisma.user.create({
        data: {
          name: `Test User ${random}`,
          email: `test.${random}@test.com`
        }
      })
    default:
      throw new Error(`typeName ${itemTypeName} not implemented`)
  }
}

const program = new Command()
program.version('0.0.1')
program.option('-l --list <type>', 'list items')
program.option('-a --add <type>', 'Add a test item')

async function main() {
  program.parse(process.argv)
  const options = program.opts();
  console.log(options)
  if (options.list) {
    const allItems = await getAllItems(options.list)
    console.log(allItems)
  }
  if (options.add) {
    const item = await addTestItem(options.add)
  }
}

main()
  .catch((e) => {
    // console.error(e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

