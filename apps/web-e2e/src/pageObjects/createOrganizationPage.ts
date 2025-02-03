/* eslint-disable testing-library/prefer-screen-queries */
import { Page, expect } from '@playwright/test'

export const createOrganizationPage = (page: Page) => {
  const gotoOrganizationPage = async () => {
    await page.goto('http://localhost:3000/organizations')
    await page.getByRole('link', { name: 'New organization' }).click()
  }

  const createOrganizationWithAddress = async (organizationTitle: string, organizationAddress: string) => {
    await gotoOrganizationPage()
    await page.fill('[placeholder="Enter an organization name"]', organizationTitle)
    await page.fill('[placeholder="Enter an organization address"]', organizationAddress)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).not.toHaveURL('/organizations/new')
  }

  return {
    createOrganizationWithAddress,
  }
}
