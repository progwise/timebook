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
  const baseUrl = 'http://localhost:3000/week'
  const weekUrlPattern = /\/week\/\d{4}-\d{2}-\d{2}\?userId=\w+/

  test('displays the current month', async () => {
    const currentMonthString = format(new Date(), 'MMMM')
    await page.goto(`${baseUrl}`)
    const header = page.getByRole('heading', { name: currentMonthString }).nth(0)

    await expect(header).toBeVisible()
  })

  test('changes to the next week', async () => {
    await page.goto(`${baseUrl}`)

    await page.getByRole('button', { name: 'Next week' }).click()
    await expect(page).toHaveURL(weekUrlPattern)
  })

  test('changes to the previous week', async () => {
    await page.goto(`${baseUrl}`)
    await page.getByRole('button', { name: 'Previous week' }).click()

    await expect(page).toHaveURL(weekUrlPattern)
  })

  test('enters work hours', async () => {
    test.setTimeout(60 * 1000)
    await page.goto(`${baseUrl}`)

    const taskRow = page.getByRole('row', { name: 'E2E Task' })
    await expect(taskRow).toBeVisible()

    let currentHours = 0
    const textboxes = await taskRow.getByRole('textbox', { name: 'duration' }).all()
    for (const textbox of textboxes) {
      await textbox.fill('1:00')
      await page.keyboard.press('Tab')
      currentHours++
      await expect(textbox).toHaveValue('1:00')
    }

    await expect(taskRow.getByText(`${currentHours}:00`)).toBeVisible()
  })

  test('enters a comment', async () => {
    await page.goto(`${baseUrl}`)
    await page.getByRole('button', { name: 'Comments' }).click()

    const commentBox = page.getByRole('textbox', { name: 'comment' }).first()
    await commentBox.fill('a comment')
    await expect(commentBox).toHaveValue('a comment')

    await page.getByRole('button', { name: 'Close', exact: true }).click()

    const indicator = page.getByTitle('1 comment')
    await expect(indicator).toBeVisible()
  })
})
