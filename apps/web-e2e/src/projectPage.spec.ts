import { expect, test } from '@playwright/test'

import { users } from './globalSetup'

test.describe('project page', () => {
  test.use({ storageState: users.existingUser.storageStatePath })

  test('it should be possible to create a new project', async ({ page }, testInfo) => {
    const projectName = `Project ${testInfo.project.name}`

    await page.goto('/test-team/projects')
    await page.click('text=Add')

    await page.fill('[placeholder="Enter project name"]', projectName)
    await page.fill('text="Start"', '2022-01-01')
    await page.fill('text="End"', '2023-01-01')

    await page.click('text=Save')

    await expect(page).toHaveURL('/test-team/projects')

    await expect(page.locator(`text=${projectName}`).first()).toBeVisible()
  })
})
