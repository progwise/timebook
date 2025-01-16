import { Page, expect } from '@playwright/test'
import { format } from 'date-fns'

export class ProjectsPage {
  private _page: Page

  constructor(page: Page) {
    this._page = page
  }

  private async _gotoProjectPage() {
    await this._page.getByRole('link', { name: 'Projects' }).click()
    await this._page.waitForLoadState('load')
  }

  public async addProject(projectName: string, startDate?: Date, endDate?: Date) {
    await this._gotoProjectPage()
    const newProjectButton = this._page.getByRole('button', { name: 'New project' })
    await newProjectButton.waitFor({ state: 'visible', timeout: 30_000 })
    await newProjectButton.click()
    await this._page.fill('[placeholder="Enter project name"]', projectName)
    if (startDate) {
      await this._page.fill('text="Start"', format(startDate, 'yyyy-MM-dd'))
    }

    if (endDate) {
      await this._page.fill('text="End"', format(endDate, 'yyyy-MM-dd'))
    }

    await this._page.getByRole('button', { name: 'Create' }).click()

    await expect(this._page).not.toHaveURL('/projects/new')
  }

  public async addTask(projectName: string, taskName: string) {
    await this._gotoProjectPage()
    await this._page.getByRole('link', { name: projectName }).click()

    const taskTitleInput = this._page.getByPlaceholder('Enter a new task name')
    await taskTitleInput.fill(taskName)
    await this._page.getByRole('button', { name: 'Add', exact: true }).click()

    await expect(taskTitleInput).toHaveValue('')
  }
}
