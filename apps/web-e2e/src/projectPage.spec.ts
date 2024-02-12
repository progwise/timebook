/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { addYears } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('project page', () => {
  test('it should be possible to create a new project', async ({ loginPage, projectsPage }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
  })

  test('it should be possible to create a new task', async ({ loginPage, projectsPage }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
    await projectsPage.addTask('Test Project', 'Test Task')
  })

  test('it should be possible to open members tab', async ({ loginPage, projectsPage, page }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
    await page.getByRole('tab', { name: 'Members', exact: true }).click()
    await expect(page.getByText('Admin')).toBeVisible()
  })
})
