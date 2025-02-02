/* eslint-disable testing-library/prefer-screen-queries */
import { Page, expect } from '@playwright/test'
import { format } from 'date-fns'

export const createProjectsPage = (page: Page) => {
  const gotoProjectPage = async () => {
    await page.goto('http://localhost:3000/projects/new')
  }

  const createProjectWithTask = async (projectTitle: string, taskTitle: string, startDate?: Date, endDate?: Date) => {
    await gotoProjectPage()
    await page.fill('[placeholder="Enter project name"]', projectTitle)
    if (startDate) {
      await page.fill('text="Start"', format(startDate, 'yyyy-MM-dd'))
    }

    if (endDate) {
      await page.fill('text="End"', format(endDate, 'yyyy-MM-dd'))
    }

    await page.getByRole('button', { name: 'Create' }).click()

    const taskTitleInput = page.getByPlaceholder('Enter a new task name')
    await taskTitleInput.fill(taskTitle)
    await page.getByRole('button', { name: 'Add', exact: true }).click()

    await expect(page).not.toHaveURL('/projects/new')
  }

  const deleteProject = async (projectTitle: string) => {
    await page.goto('http://localhost:3000/projects')
    await page.getByRole('link', { name: `${projectTitle}` }).click()
    await page
      .getByRole('button', { name: /^(Delete|Archive)$/, exact: true })
      .nth(0)
      .click()
    await page
      .getByRole('button', { name: /^(Delete|Archive)$/, exact: true })
      .nth(1)
      .click()
    await expect(page).toHaveURL('/projects')
  }

  return {
    createProjectWithTask,
    deleteProject,
  }
}
