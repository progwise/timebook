/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'

import { test } from './pageObjects/testFixtures'

test.describe('organization page', () => {
  test.beforeEach(async ({ loginPage, organizationPage }) => {
    await loginPage.login()
    await organizationPage.createOrganizationWithAddress('Test Organization', 'Test Address')
  })

  test('creates a new organization with address and then archive the organization', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Organization Test Organization' })).toBeVisible()
    // Check PayPal badge
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByPlaceholder('Enter an organization address')).toHaveValue('Test Address')
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(0).click()
    // Confirm archiving on the dialog
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(1).click()
    await expect(page).toHaveURL('/organizations')
  })
})
