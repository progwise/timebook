/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { addYears } from 'date-fns'

import { PrismaClient } from '@progwise/timebook-prisma'

import { test } from './pageObjects/testFixtures'

const prisma = new PrismaClient()

test.describe('project page', () => {
  test.beforeEach(async ({ loginPage, projectsPage }) => {
    await loginPage.login()
    const today = new Date()
    await projectsPage.createProjectWithTask('E2E Project', 'E2E Task', today, addYears(today, 1))
  })

  test.afterEach(async ({ projectsPage }) => {
    await projectsPage.deleteProject('E2E Project')
  })

  test('creates a new project with task and opens members tab', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Project E2E Project', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'E2E Task', exact: true })).toBeVisible()
    await page.getByRole('tab', { name: 'Members', exact: true }).click()
    await expect(page.getByText('Admin')).toBeVisible()
  })

  test.afterAll(async () => {
    await prisma.project.deleteMany({ where: { title: 'E2E Project' } })
  })
})
