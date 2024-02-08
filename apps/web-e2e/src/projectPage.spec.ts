import { addYears } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('project page', () => {
  test('it should be possible to create a new project', async ({ loginPage, projectsPage }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
  })
})
