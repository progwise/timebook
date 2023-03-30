import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { mockServer } from '../../mocks/mockServer'
import {
  mockReportLockMutation,
  mockReportProjectsQuery,
  mockReportQuery,
  mockReportUnlockMutation,
  mockReportUsersQuery,
} from '../../mocks/mocks.generated'
import { ReportForm } from './reportForm'

jest.mock('next/router', () => ({ useRouter: () => ({ isReady: true }) }))

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

let isLocked = false

beforeAll(() => {
  mockServer.use(
    mockReportProjectsQuery((_request, response, context) =>
      response(
        context.data({
          projects: [{ id: 'project1', title: 'Project 1', __typename: 'Project' }],
          __typename: 'Query',
        }),
      ),
    ),
    mockReportUsersQuery((_request, response, context) => {
      return response(
        context.data({
          project: {
            id: 'project1',
            members: [{ id: '1', name: 'User 1', durationWorkedOnProject: 0, __typename: 'User' }],
            __typename: 'Project',
          },
          __typename: 'Query',
        }),
      )
    }),
    mockReportQuery((_request, response, context) =>
      response(
        context.data({
          project: { canModify: true },
          report: { groupedByDate: [], groupedByTask: [], groupedByUser: [], isLocked, __typename: 'Report' },
          __typename: 'Query',
        }),
      ),
    ),
    mockReportLockMutation((_request, response, context) => {
      isLocked = true
      return response(context.data({ reportLock: { isLocked, __typename: 'Report' }, __typename: 'Mutation' }))
    }),
    mockReportUnlockMutation((_request, response, context) => {
      isLocked = false
      return response(context.data({ reportUnlock: { isLocked, __typename: 'Report' }, __typename: 'Mutation' }))
    }),
  )
})

it('should be possible to lock and unlock a report', async () => {
  const user = userEvent.setup()
  render(<ReportForm />, { wrapper })

  const projectSelect = await screen.findByRole('button', { name: 'Select Project' })
  await user.click(projectSelect)
  const project1Option = await screen.findByRole('option', { name: 'Project 1' })
  await user.click(project1Option)

  const userSelect = await screen.findByRole('button', { name: 'All Users (0:00)' })
  await user.click(userSelect)
  const user1Option = await screen.findByRole('option', { name: 'User 1 (0:00)' })
  await user.click(user1Option)

  const lockCheckbox = screen.getByRole('checkbox', { name: 'Lock Report' })
  expect(lockCheckbox).not.toBeChecked()

  await user.click(lockCheckbox)
  await waitFor(() => expect(lockCheckbox).toBeChecked())
  expect(isLocked).toBeTruthy()

  await user.click(lockCheckbox)
  await waitFor(() => expect(lockCheckbox).not.toBeChecked())
  expect(isLocked).toBeFalsy()
})
