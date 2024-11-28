import { Page } from '@playwright/test'
import { createHash, randomBytes } from 'crypto'
import { addYears } from 'date-fns'

import { PrismaClient } from '@progwise/timebook-prisma'

const prisma = new PrismaClient()

export class LoginPage {
  private _email: string
  private _page: Page

  constructor(page: Page) {
    this._email = randomBytes(4).toString('hex') + '@progwise.net'
    this._page = page
  }

  private async _gotoHomePage() {
    await this._page.goto('http://localhost:3000')
  }

  async login() {
    const token = randomBytes(10).toString('hex')
    const hashedToken = createHash('sha256')
      .update(`${token}${process.env.SECRET ?? ''}`)
      .digest('hex')
    const todayInOneYear = addYears(new Date(), 1)

    const signInUrl = `http://localhost:3000/api/auth/callback/email?&token=${token}&email=${this._email}`

    await prisma.verificationToken.create({
      data: {
        identifier: this._email,
        token: hashedToken,
        expires: todayInOneYear,
      },
    })

    await this._page.goto(signInUrl)
    await this._page.waitForURL('http://localhost:3000/week')
    await this._gotoHomePage()
  }

  async deleteAccount() {
    await prisma.workHour.deleteMany({ where: { user: { email: this._email } } })
    await prisma.user.delete({ where: { email: this._email } })
  }

  get email() {
    return this._email
  }
}
