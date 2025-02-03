/* eslint-disable testing-library/prefer-screen-queries */
import { expect, BrowserContext, Page } from '@playwright/test'

import { createOrganizationPage } from './pageObjects/createOrganizationPage'
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
  const organizationPage = createOrganizationPage(page)
  await loginPage.login()
  await organizationPage.createOrganizationWithAddress('E2E Organization', 'E2E Address')
})

test.afterAll(async () => {
  await page.close()
  await context.close()
})

test.describe('organization page', () => {
  test('creates a new organization with address', async () => {
    await expect(page.getByPlaceholder('Enter an organization name')).toHaveValue('E2E Organization')
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByPlaceholder('Enter an organization address')).toHaveValue('E2E Address')
  })

  test('deletes the organization', async () => {
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(0).click()
    // Confirm archiving on the dialog
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(1).click()
    await expect(page).toHaveURL('/organizations')
  })
})
