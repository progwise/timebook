import { mockTaskDeleteMutation } from '../generated/graphql'

export const taskHandlers = [
  mockTaskDeleteMutation((request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskDelete: {
          id: '1',
          hasWorkHours: false,
          project: { id: 'ProjectId', title: 'Projects' },
          title: 'Task 1',
        },
      }),
    ),
  ),
]
