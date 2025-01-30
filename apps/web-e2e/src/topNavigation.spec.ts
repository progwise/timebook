/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'

import { test } from './pageObjects/testFixtures'

test.describe('top navigation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login()
  })

  test('navigates to week page', async ({ page }) => {
    const weekButton = page.getByRole('link', { name: 'Week' })
    await weekButton.click()
    await expect(page).toHaveURL(/\/week(\?.*)?$/)
  })
  test('navigates to organizations page', async ({ page }) => {
    const organizationButton = page.getByRole('link', { name: 'Organization' }).nth(0)
    await organizationButton.click()
    await expect(page).toHaveURL('/organizations')
  })

  test('navigates to projects page', async ({ page }) => {
    const projectsButton = page.getByRole('link', { name: 'Projects' }).nth(0)
    await projectsButton.click()
    await expect(page).toHaveURL('/projects')
  })
})
