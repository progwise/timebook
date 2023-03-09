import { mockMyProjectsQuery, mockTimeTableQuery } from '../generated/graphql'
import { testProject1, testProject2 } from './testData'

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
  mockTimeTableQuery((_request, response, context) =>
    response(
      context.data({
        __typename: 'Query',
        projects: [
          { ...testProject1, tasks: testProject1.tasks.map((task) => ({ ...task, workHours: [] })) },
          { ...testProject2, tasks: testProject2.tasks.map((task) => ({ ...task, workHours: [] })) },
        ],
      }),
    ),
  ),
]
