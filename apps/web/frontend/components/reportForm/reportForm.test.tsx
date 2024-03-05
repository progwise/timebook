import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { mockServer } from '../../mocks/mockServer'
import {
  mockProjectLockMutation,
  mockProjectUnlockMutation,
  mockReportProjectsQuery,
  mockReportQuery,
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
          projects: [
            {
              id: 'project1',
              title: 'Project 1',
              __typename: 'Project',
              isLocked,
              canModify: false,
              isArchived: false,
            },
          ],
          __typename: 'Query',
        }),
      ),
    ),
    mockReportUsersQuery((_request, response, context) => {
      return response(
        context.data({
          project: {
            id: 'project1',
            members: [
              { id: '1', name: 'User 1', durationWorkedOnProject: 5, __typename: 'User' },
              { id: '2', name: 'User 2', durationWorkedOnProject: 10, __typename: 'User' },
            ],
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
          report: {
            groupedByDate: [
              {
                date: '2024-02-16',
                duration: 487,
                workHours: [
                  {
                    id: '1',
                    duration: 300,
                    user: {
                      id: '1',
                      name: 'User 1',
                      __typename: 'User',
                    },
                    task: {
                      id: '1',
                      title: 'Task 1',
                      __typename: 'Task',
                    },
                    __typename: 'WorkHour',
                  },
                  {
                    id: '2',
                    duration: 180,
                    user: {
                      id: '2',
                      name: 'User 2',
                      __typename: 'User',
                    },
                    task: {
                      id: '1',
                      title: 'Task 1',
                      __typename: 'Task',
                    },
                    __typename: 'WorkHour',
                  },
                  {
                    id: '3',
                    duration: 180,
                    user: {
                      id: '2',
                      name: 'User 2',
                      __typename: 'User',
                    },
                    task: {
                      id: '2',
                      title: 'Task 2',
                      __typename: 'Task',
                    },
                    __typename: 'WorkHour',
                  },
                ],
              },
            ],
            groupedByTask: [],
            groupedByUser: [],
            __typename: 'Report',
          },
          __typename: 'Query',
        }),
      ),
    ),
    mockProjectLockMutation((_request, response, context) => {
      isLocked = true
      return response(context.data({ projectLock: { isLocked, __typename: 'Project' }, __typename: 'Mutation' }))
    }),
    mockProjectUnlockMutation((_request, response, context) => {
      isLocked = false
      return response(context.data({ projectUnlock: { isLocked, __typename: 'Project' }, __typename: 'Mutation' }))
    }),
  )
})

it('should be possible to lock and unlock a report', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const lockButton = await screen.findByRole('button', { name: /^Lock/ })

  await user.click(lockButton)
  await waitFor(() => expect(lockButton).toHaveTextContent(/^Unlock/))
  expect(isLocked).toBeTruthy()

  await user.click(lockButton)
  await waitFor(() => expect(lockButton).not.toBeChecked())
  expect(isLocked).toBeFalsy()
})

it('should be possible to group by task', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const groupedByButton = await screen.findByRole('button', { name: /^All Details/ })
  await user.click(groupedByButton)

  const groupedByTask = await screen.findByText('Grouped by Task')
  await user.click(groupedByTask)

  const cells = await screen.findAllByRole('cell', {
    name: /user 1, user 2/i,
  })
  expect(cells).toHaveLength(1)
})

it('should be possible to group by user', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const groupedByButton = await screen.findByRole('button', { name: /^All Details/ })
  await user.click(groupedByButton)

  const groupedByUser = await screen.findByText('Grouped by User')
  await user.click(groupedByUser)

  const cells = await screen.findAllByRole('cell', {
    name: /task 1, task 2/i,
  })
  expect(cells).toHaveLength(1)
})
