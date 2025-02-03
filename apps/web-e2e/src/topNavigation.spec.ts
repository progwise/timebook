/* eslint-disable testing-library/prefer-screen-queries */
import { expect, BrowserContext, Page } from '@playwright/test'

import { createLoginPage } from './pageObjects/loginPage'
import { test } from './pageObjects/testFixtures'

test.describe.configure({ mode: 'serial' })

let context: BrowserContext
let page: Page

test.beforeAll(async ({ browser }) => {
  test.setTimeout(60 * 1000)
  context = await browser.newContext()
  page = await context.newPage()
  const loginPage = createLoginPage(page)
  await loginPage.login()
})

test.afterAll(async () => {
  await page.close()
  await context.close()
})
test.describe('top navigation', () => {
  test('navigates to week page', async () => {
    const weekButton = page.getByRole('link', { name: 'Week' })
    await weekButton.click()
    await expect(page).toHaveURL(/\/week(\?.*)?$/)
  })
  test('navigates to organizations page', async () => {
    const organizationButton = page.getByRole('link', { name: 'Organization' }).nth(0)
    await organizationButton.click()
    await expect(page).toHaveURL('/organizations')
  })

  test('navigates to projects page', async () => {
    const projectsButton = page.getByRole('link', { name: 'Projects' }).nth(0)
    await projectsButton.click()
    await expect(page).toHaveURL('/projects')
  })
})
