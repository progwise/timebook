import { mockProjectsWithTasksQuery } from '../generated/graphql'
import { testProject1, testProject2 } from './testData'

export const projectHandlers = [
  mockProjectsWithTasksQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        projects: [testProject1, testProject2],
      }),
    )
    return result
  }),
]
