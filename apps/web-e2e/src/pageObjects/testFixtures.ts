import { test as base } from '@playwright/test'

import { LoginPage } from './loginPage'
import { ProjectsPage } from './projectsPage'

type MyFixtures = {
  loginPage: LoginPage
  projectsPage: ProjectsPage
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)

    await use(loginPage)

    await loginPage.deleteAccount()
  },
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page)

    await use(projectsPage)
  },
})
