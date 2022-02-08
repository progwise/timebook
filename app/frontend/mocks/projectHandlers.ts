import { mockProjectsQuery } from '../generated/graphql'
import { testProject } from './testData'

export const projectHandlers = [
  mockProjectsQuery((request, response, context) =>
    response(
      context.data({
        __typename: 'Query',
        projects: [testProject],
      }),
    ),
  ),
]
