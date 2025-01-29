/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { addYears } from 'date-fns'

import { PrismaClient } from '@progwise/timebook-prisma'

import { test } from './pageObjects/testFixtures'

const prisma = new PrismaClient()

test.describe('report page', () => {
  test.beforeEach(async ({ loginPage, projectsPage }) => {
    await loginPage.login()
    const today = new Date()
    await projectsPage.createProjectWithTask('E2E Project', 'E2E Task', today, addYears(today, 1))
  })

  test('renders report page with total hours and lock the month', async ({ page }) => {
    await page.goto('http://localhost:3000/reports')
    await page.getByRole('button', { name: 'Select Project' }).click()
    await page.getByText('E2E Project').click()

    await expect(page.getByText('Total hours')).toBeVisible()
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^0:00$/ })
        .locator('span'),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Lock', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Unlock', exact: true })).toBeVisible()
  })

  test.afterAll(async () => {
    await prisma.workHour.deleteMany({ where: { task: { title: 'E2E Task' } } })
    await prisma.lockedMonth.deleteMany({ where: { project: { title: 'E2E Project' } } })
    await prisma.project.deleteMany({ where: { title: 'E2E Project' } })
  })
})
