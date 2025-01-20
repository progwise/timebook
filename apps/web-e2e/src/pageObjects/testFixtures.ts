import { test as base } from '@playwright/test'

import { createLoginPage } from './loginPage'
import { createOrganizationsPage } from './organizationsPage'
import { createProjectsPage } from './projectsPage'

type MyFixtures = {
  loginPage: ReturnType<typeof createLoginPage>
  projectsPage: ReturnType<typeof createProjectsPage>
  organizationPage: ReturnType<typeof createOrganizationsPage>
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page)

    await use(loginPage)

    await loginPage.deleteAccount()
  },
  projectsPage: async ({ page }, use) => {
    const projectsPage = createProjectsPage(page)

    await use(projectsPage)
  },
  organizationPage: async ({ page }, use) => {
    const organizationPage = createOrganizationsPage(page)

    await use(organizationPage)
  },
})
