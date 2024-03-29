/* eslint-disable testing-library/no-await-sync-query */

/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { format } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('week page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login()
  })

  test('it should display the current month', async ({ page }) => {
    const currentMonthString = format(new Date(), 'MMMM')

    await page.getByRole('link', { name: 'Week' }).click()
    const header = await page.getByText(currentMonthString)
    await expect(header).toBeVisible()
  })

  test('it should be possible to change the week', async ({ page }) => {
    await page.getByRole('link', { name: 'Week' }).click()
    await page.getByRole('button', { name: 'Next week' }).click()

    await expect(page).not.toHaveURL('/week')

    await page.getByRole('button', { name: 'Previous week' }).click()

    await expect(page).toHaveURL('/week')
  })

  test('it should be possible to enter work hours', async ({ page, projectsPage }) => {
    await projectsPage.addProject('Test Project')
    await projectsPage.addTask('Test Project', 'Test Task')

    await page.getByRole('link', { name: 'Week' }).click()

    const taskRow = await page.getByRole('row', { name: `Test Task` })
    await expect(taskRow).toBeVisible()

    let currentHours = 0

    for (const textbox of await taskRow.getByRole('textbox').all()) {
      await textbox.fill('1:00')
      await page.keyboard.press('Tab')
      currentHours++

      await expect(taskRow.getByText(`${currentHours}:00`)).toBeVisible()
    }
  })
})
