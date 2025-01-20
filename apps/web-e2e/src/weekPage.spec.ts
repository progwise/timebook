/* eslint-disable testing-library/no-await-sync-query */

/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { format } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('week page', () => {
  test.beforeEach(async ({ loginPage, projectsPage }) => {
    await loginPage.login()
    await projectsPage.createProjectWithTask('Test Project', 'Test Task')
  })

  test('displays the current month and changes week', async ({ page }) => {
    const currentMonthString = format(new Date(), 'MMMM')
    await page.goto('http://localhost:3000/week')
    const header = page.getByRole('heading', { name: currentMonthString }).nth(0)
    await expect(header).toBeVisible()

    await page.getByRole('button', { name: 'Next week' }).click()
    await expect(page).not.toHaveURL('/week')

    await page.getByRole('button', { name: 'Previous week' }).click()

    await expect(page).toHaveURL(/\/week(\?.*)?$/)
  })

  test('enters work hours', async ({ page }) => {
    await page.goto('http://localhost:3000/week')

    const taskRow = page.getByRole('row', { name: 'Test Task' })
    await expect(taskRow).toBeVisible()

    let currentHours = 0

    for (const textbox of await taskRow.getByRole('textbox', { name: 'duration' }).all()) {
      await textbox.fill('1:00')
      await page.keyboard.press('Tab')
      currentHours++

      await expect(taskRow.getByText(`${currentHours}:00`)).toBeVisible()
    }
  })

  test('enters a comment', async ({ page }) => {
    await page.goto('http://localhost:3000/week')

    await page.getByRole('button', { name: 'Comments' }).click()

    await page.getByRole('textbox', { name: 'comment' }).first().fill('a comment')

    await page.getByRole('button', { name: 'Close', exact: true }).click()

    const indicator = page.getByTitle('1 comment')
    await expect(indicator).toBeVisible()
  })
})
