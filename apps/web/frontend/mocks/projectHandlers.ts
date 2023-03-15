import { mockMyProjectsQuery, mockWeekTableQuery } from './mocks.generated'

const testProject1 = { id: 'project1', title: 'Project 1' }
const testProject2 = { id: 'project2', title: 'Project 2' }

export const projectHandlers = [
  mockMyProjectsQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        projects: [testProject1, testProject2],
      }),
    )
    return result
  }),
  mockWeekTableQuery((_request, response, context) =>
    response(
      context.data({
        __typename: 'Query',
        projects: [
          {
            ...testProject1,
            tasks: [{ id: 'task1', title: 'Task 1', workHours: [], project: { id: testProject1.id } }],
          },
          { ...testProject2, tasks: [] },
        ],
      }),
    ),
  ),
]
