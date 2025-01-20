/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { addYears } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('project page', () => {
  test.beforeEach(async ({ loginPage, projectsPage }) => {
    await loginPage.login()
    const today = new Date()
    await projectsPage.createProjectWithTask('Test Project', 'Test Task', today, addYears(today, 1))
  })

  test('creates a new project and task and then delete the project', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Project Test Project', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Test Task', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Delete', exact: true }).nth(0).click()
    // Confirm the deletion on the dialog
    await page.getByRole('button', { name: 'Delete', exact: true }).nth(1).click()
    await expect(page).toHaveURL('/projects')
  })

  test('opens the members tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Members', exact: true }).click()
    await expect(page.getByText('Admin')).toBeVisible()
  })
})
