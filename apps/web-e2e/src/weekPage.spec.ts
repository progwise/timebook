/* eslint-disable testing-library/no-await-sync-query */

/* eslint-disable testing-library/prefer-screen-queries */
import { expect, BrowserContext, Page } from '@playwright/test'
import { format } from 'date-fns'

import { createLoginPage } from './pageObjects/loginPage'
import { createProjectsPage } from './pageObjects/projectsPage'
import { test } from './pageObjects/testFixtures'

test.describe.configure({ mode: 'serial' })

let context: BrowserContext
let page: Page

test.beforeAll(async ({ browser }) => {
  test.setTimeout(60 * 1000)
  context = await browser.newContext()
  page = await context.newPage()
  const loginPage = createLoginPage(page)
  const projectsPage = createProjectsPage(page)
  await loginPage.login()
  await projectsPage.createProjectWithTask('E2E Project', 'E2E Task')
})

test.afterAll(async () => {
  await page.close()
  await context.close()
})

test.describe('week page', () => {
  test('displays the current month', async () => {
    const currentMonthString = format(new Date(), 'MMMM')
    await page.goto('http://localhost:3000/week')
    const header = page.getByRole('heading', { name: currentMonthString }).nth(0)

    await expect(header).toBeVisible()
  })

  test('changes to the next week', async () => {
    await page.goto('http://localhost:3000/week')

    await page.getByRole('button', { name: 'Next week' }).click()
    await expect(page).not.toHaveURL('/week')
  })

  test('changes to the previous week', async () => {
    await page.goto('http://localhost:3000/week')
    await page.getByRole('button', { name: 'Previous week' }).click()

    await expect(page).toHaveURL(/\/week(\?.*)?$/)
  })

  test('enters work hours', async () => {
    await page.goto('http://localhost:3000/week')

    const taskRow = page.getByRole('row', { name: 'E2E Task' })
    await expect(taskRow).toBeVisible()

    let currentHours = 0

    const textboxes = await taskRow.getByRole('textbox', { name: 'duration' }).all()
    for (const textbox of textboxes) {
      await textbox.fill('1:00')
      await page.keyboard.press('Tab')
      currentHours++
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(500)
    }

    await expect(taskRow.getByText(`${currentHours}:00`)).toBeVisible()
  })

  test('enters a comment', async () => {
    await page.goto('http://localhost:3000/week')
    await page.getByRole('button', { name: 'Comments' }).click()

    const commentBox = page.getByRole('textbox', { name: 'comment' }).first()
    await commentBox.fill('a comment')

    await page.getByRole('button', { name: 'Close', exact: true }).click()

    await expect(commentBox).toHaveValue('a comment')

    const indicator = page.getByTitle('1 comment')
    await expect(indicator).toBeVisible()
  })
})
