import { Browser, chromium } from '@playwright/test'
import { addYears } from 'date-fns'
import dotenv from 'dotenv'
import { createHash, randomBytes } from 'node:crypto'

import { PrismaClient } from '@progwise/timebook-prisma'

dotenv.config({ path: '../../apps/web/.env' })

interface User {
  email: string
  storageStatePath: string
}

export const users = {
  newUser: {
    email: 'e2e-new@progwise.net',
    storageStatePath: '.storage-states/newStorageState.json',
  },
  existingUser: {
    email: 'e2e@progwise.net',
    storageStatePath: '.storage-states/existingUserStorageState.json',
  },
}

const prisma = new PrismaClient()

const createUserSession = async (options: { browser: Browser; user: User }): Promise<void> => {
  const token = randomBytes(10).toString('hex')
  const hashedToken = createHash('sha256')
    .update(`${token}${process.env.SECRET ?? ''}`)
    .digest('hex')
  const todayInOneYear = addYears(new Date(), 1)

  const signInUrl = `http://localhost:3000/api/auth/callback/email?&token=${token}&email=${options.user.email}`

  await prisma.verificationToken.create({
    data: {
      identifier: options.user.email,
      token: hashedToken,
      expires: todayInOneYear,
    },
  })

  const page = await options.browser.newPage()
  await page.goto(signInUrl)
  await page.waitForURL('http://localhost:3000/home')
  await page.context().storageState({ path: options.user.storageStatePath })
}

const globalSetup = async () => {
  const browser = await chromium.launch()

  await createUserSession({ browser, user: users.newUser })
  await createUserSession({ browser, user: users.existingUser })

  await browser.close()
}

export default globalSetup
