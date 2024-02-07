import { addYears } from 'date-fns'

import { test } from './pageObjects/testFixtures'

test.describe('project details page', () => {
  test('it should be possible to create a new task', async ({ loginPage, projectsPage }) => {
    await loginPage.login()

    const today = new Date()
    await projectsPage.addProject('Test Project', today, addYears(today, 1))
    await projectsPage.addTask('Details', 'Test Task')
  })
})
