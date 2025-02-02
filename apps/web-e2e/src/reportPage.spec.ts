/* eslint-disable testing-library/prefer-screen-queries */
import { expect, BrowserContext, Page } from '@playwright/test'

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

test('renders report page with total hours and lock the month', async () => {
  await page.goto('http://localhost:3000/reports')
  await page.getByRole('button', { name: 'Select Project' }).click()
  await page.getByText('E2E Project').click()

  await expect(page.getByText('Total hours')).toBeVisible()
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^0:00$/ })
      .locator('span'),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Lock', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Unlock', exact: true })).toBeVisible()
})
