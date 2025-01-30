import { Page } from '@playwright/test'
import { createHash, randomBytes } from 'crypto'
import { addYears } from 'date-fns'

import { PrismaClient } from '@progwise/timebook-prisma'

const prisma = new PrismaClient()

export const createLoginPage = (page: Page) => {
  const email = randomBytes(4).toString('hex') + '@progwise.net'

  const login = async () => {
    const token = randomBytes(10).toString('hex')
    const hashedToken = createHash('sha256')
      .update(`${token}${process.env.SECRET ?? ''}`)
      .digest('hex')
    const todayInOneYear = addYears(new Date(), 1)

    const signInUrl = `http://localhost:3000/api/auth/callback/email?&token=${token}&email=${email}`

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: todayInOneYear,
      },
    })

    await page.goto(signInUrl, { waitUntil: 'domcontentloaded' })
    await page.waitForURL('http://localhost:3000/week')
  }

  const deleteAccount = async () => {
    await prisma.workHour.deleteMany({ where: { user: { email } } })
    await prisma.user.delete({ where: { email } })
  }

  return {
    login,
    deleteAccount,
    get email() {
      return email
    },
  }
}
