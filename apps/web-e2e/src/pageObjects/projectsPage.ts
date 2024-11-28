import { Page, expect } from '@playwright/test'
import { format } from 'date-fns'

export class ProjectsPage {
  private _page: Page

  constructor(page: Page) {
    this._page = page
  }

  private async _gotoHomePage() {
    await this._page.goto('http://localhost:3000')
  }

  private async _gotoProjectPage() {
    await this._gotoHomePage()
    await this._page.getByRole('link', { name: 'Projects' }).click()
  }

  public async addProject(projectName: string, startDate?: Date, endDate?: Date) {
    await this._gotoProjectPage()
    await this._page.getByRole('button', { name: 'New project' }).click()
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

    const projectTitleInput = this._page.getByPlaceholder('Enter a new task name')
    await projectTitleInput.fill(taskName)
    await this._page.getByRole('button', { name: 'Add', exact: true }).click()

    await expect(projectTitleInput).toHaveValue('')
  }
}
