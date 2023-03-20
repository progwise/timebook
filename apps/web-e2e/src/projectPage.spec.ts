import { expect, test } from '@playwright/test'
import { addYears, format } from 'date-fns'

import { users } from './globalSetup'

test.describe('project page', () => {
  test.use({ storageState: users.existingUser.storageStatePath })

  test('it should be possible to create a new project', async ({ page }, testInfo) => {
    const projectName = `Project ${testInfo.project.name}`
    const today = new Date()
    const startDate = format(today, 'yyyy-MM-dd')
    const endDate = format(addYears(today, 1), 'yyyy-MM-dd')

    await page.goto('/projects')
    await page.click('text=Add')

    await page.fill('[placeholder="Enter project name"]', projectName)
    await page.fill('text="Start"', startDate)
    await page.fill('text="End"', endDate)

    await page.click('text=Create')

    await expect(page).toHaveURL('/projects')

    await expect(page.locator(`text=${projectName}`).first()).toBeVisible()
  })
})
