/* eslint-disable testing-library/prefer-screen-queries */
import { expect, BrowserContext, Page } from '@playwright/test'
import { addYears } from 'date-fns'

import { createProjectsPage } from './pageObjects/createProjectPage'
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
  const projectsPage = createProjectsPage(page)
  await loginPage.login()
  const today = new Date()
  await projectsPage.createProjectWithTask('E2E Project', 'E2E Task', today, addYears(today, 1))
})

test.afterAll(async () => {
  await page.close()
  await context.close()
})

test.describe('project page', () => {
  test('creates a new project and task', async () => {
    await expect(page.getByRole('heading', { name: 'Project E2E Project', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'E2E Task', exact: true })).toBeVisible()
  })

  test('opens the members tab', async () => {
    await page.getByRole('tab', { name: 'Members', exact: true }).click()
    await expect(page.getByText('Admin')).toBeVisible()
  })

  test('deletes the project', async () => {
    await page.getByRole('button', { name: 'Delete', exact: true }).nth(0).click()
    // Confirm the deletion on the dialog
    await page.getByRole('button', { name: 'Delete', exact: true }).nth(1).click()
    await expect(page).toHaveURL('/projects')
  })
})
