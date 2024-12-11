import {
  mockProjectLockMutation,
  mockProjectUnlockMutation,
  mockReportProjectsQuery,
  mockReportQuery,
  mockReportUsersQuery,
} from './mocks.generated'

let isLocked = false

export { isLocked }

export const reportHandlers = [
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
]
