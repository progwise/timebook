import { expect, test } from '@playwright/test'

import { users } from './globalSetup'
import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

test.describe('team page', () => {
  test.use({ storageState: users.newUser.storageStatePath })

  test('it should be possible to create a new team', async ({ page }, testInfo) => {
    await page.goto('/')

    await page.click('text=Manage your teams')
    await page.click('text=Add a new team')

    const teamName = `New Team ${testInfo.project.name}`
    const teamSlug = `new-team-${testInfo.project.name}`

    await page.fill('role=textbox[name="Team name"]', teamName)
    await page.fill('role=textbox[name="Slug"]', teamSlug)
    await page.click('text=Save')

    await expect(page).toHaveURL(`${teamSlug}/team`)
  })

  test('it should possible to update an existing team', async ({ page }, testInfo) => {
    const teamTitleOld = `E2E Team Name ${testInfo.project.name}`
    const teamTitleNew = `New E2E Team Name ${testInfo.project.name}`
    const teamSlugOld = `e2e-team-${testInfo.project.name}`
    const teamSlugNew = `new-e2e-team-${testInfo.project.name}`

    await prisma.team.create({
      data: {
        title: teamTitleOld,
        slug: teamSlugOld,
        teamMemberships: {
          create: {
            user: { connect: { email: users.newUser.email } },
            role: 'ADMIN',
          },
        },
      },
    })

    await page.goto(`${teamSlugOld}/team`)

    await page.fill('role=textbox[name="Team name"]', teamTitleNew)
    await page.fill('role=textbox[name="Slug"]', teamSlugNew)
    await page.click('text=Save')

    await expect(page).toHaveURL(`${teamSlugNew}/team`)
  })
})
