/* eslint-disable testing-library/no-await-sync-query */

/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@playwright/test'
import { format } from 'date-fns'

import { PrismaClient } from '@progwise/timebook-prisma'

import { test } from './pageObjects/testFixtures'

const prisma = new PrismaClient()

test.describe('week page', () => {
  test.beforeEach(async ({ loginPage, projectsPage }) => {
    await loginPage.login()
    await projectsPage.createProjectWithTask('E2E Project', 'E2E Task')
  })

  test('displays the current month and changes week', async ({ page }) => {
    const currentMonthString = format(new Date(), 'MMMM')
    await page.goto('http://localhost:3000/week')
    const header = page.getByRole('heading', { name: currentMonthString }).nth(0)
    await expect(header).toBeVisible()

    await page.getByRole('button', { name: 'Next week' }).click()
    await expect(page).not.toHaveURL('/week')

    await page.getByRole('button', { name: 'Previous week' }).click()

    await expect(page).toHaveURL(/\/week(\?.*)?$/)
  })

  test('enters work hours', async ({ page }) => {
    await page.goto('http://localhost:3000/week')

    const taskRow = page.getByRole('row', { name: 'E2E Task' })
    await expect(taskRow).toBeVisible()

    let currentHours = 0

    const textboxes = await taskRow.getByRole('textbox', { name: 'duration' }).all()
    for (const textbox of textboxes) {
      await textbox.fill('1:00')
      await page.keyboard.press('Tab')
      currentHours++
      await expect(textbox).toHaveValue('1:00')
    }

    await expect(taskRow.getByText(`${currentHours}:00`)).toBeVisible()
  })

  test('enters a comment', async ({ page }) => {
    await page.goto('http://localhost:3000/week')

    await page.getByRole('button', { name: 'Comments' }).click()

    const commentBox = page.getByRole('textbox', { name: 'comment' }).first()
    await commentBox.fill('a comment')

    await page.getByRole('button', { name: 'Close', exact: true }).click()

    await expect(commentBox).toHaveValue('a comment')

    const indicator = page.getByTitle('1 comment')
    await expect(indicator).toBeVisible()
  })

  test.afterAll(async () => {
    await prisma.lockedMonth.deleteMany({ where: { project: { title: 'E2E Project' } } })
    await prisma.workHour.deleteMany({ where: { task: { title: 'E2E Task' } } })
    await prisma.project.deleteMany({ where: { title: 'E2E Project' } })
  })
})
