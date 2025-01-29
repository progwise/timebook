/* eslint-disable testing-library/prefer-screen-queries */
import { Page, expect } from '@playwright/test'

export const createOrganizationsPage = (page: Page) => {
  const gotoOrganizationPage = async () => {
    await page.goto('http://localhost:3000/organizations', { waitUntil: 'load' })
    await page.getByRole('link', { name: 'New organization' }).click()
  }

  const createOrganizationWithAddress = async (organizationTitle: string, organizationAddress: string) => {
    await gotoOrganizationPage()
    await page.fill('[placeholder="Enter an organization name"]', organizationTitle)
    await page.fill('[placeholder="Enter an organization address"]', organizationAddress)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).not.toHaveURL('/organizations/new')
  }

  const archiveOrganization = async (organizationTitle: string) => {
    await page.goto('http://localhost:3000/organizations')
    await page.getByRole('link', { name: `${organizationTitle}` }).click()
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(0).click()
    await page.getByRole('button', { name: 'Archive', exact: true }).nth(1).click()
    await expect(page).toHaveURL('/organizations')
  }

  return {
    createOrganizationWithAddress,
    archiveOrganization,
  }
}
