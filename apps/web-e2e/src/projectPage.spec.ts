/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { addYears } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('project page', () => {
  test('it should be possible to create a new project', async ({ loginPage, projectsPage, page }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))

    await page.getByRole('heading', { name: 'Project Test Project', exact: true }).waitFor({ state: 'visible' })
    await expect(page.getByRole('heading', { name: 'Project Test Project', exact: true })).toBeVisible()
  })

  test('it should be possible to create a new task', async ({ loginPage, projectsPage, page }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
    await projectsPage.addTask('Test Project', 'Test Task')

    await page.getByRole('row', { name: 'Test Task', exact: true }).waitFor({ state: 'visible' })
    await expect(page.getByRole('row', { name: 'Test Task', exact: true })).toBeVisible()
  })

  test('it should be possible to open members tab', async ({ loginPage, projectsPage, page }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
    const membersTab = page.getByRole('tab', { name: 'Members', exact: true })
    await membersTab.waitFor({ state: 'visible' })
    await membersTab.click()
    await expect(page.getByText('Admin')).toBeVisible()
  })
})
