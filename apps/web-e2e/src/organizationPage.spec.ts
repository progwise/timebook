/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'

import { test } from './pageObjects/testFixtures'

test.describe('organization page', () => {
  test.beforeEach(async ({ loginPage, organizationPage }) => {
    await loginPage.login()
    await organizationPage.createOrganizationWithAddress('E2E Organization', 'E2E Address')
  })

  test.afterEach(async ({ organizationPage }) => {
    await organizationPage.archiveOrganization('E2E Organization')
  })

  test('creates a new organization with address', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Organization E2E Organization' })).toBeVisible()
    // Check Subscription badge
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByPlaceholder('Enter an organization address')).toHaveValue('E2E Address')
  })
})
