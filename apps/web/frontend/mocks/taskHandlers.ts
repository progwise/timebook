import { mockTaskCreateMutation, mockTaskDeleteMutation, mockTaskUpdateMutation } from './mocks.generated'

export const taskHandlers = [
  mockTaskDeleteMutation((_request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskDelete: {
          id: '1',
          __typename: 'Task',
        },
      }),
    ),
  ),
  mockTaskCreateMutation((_request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskCreate: {
          id: '1',
          __typename: 'Task',
        },
      }),
    ),
  ),
  mockTaskUpdateMutation((request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskUpdate: {
          id: request.variables.id,
        },
      }),
    ),
  ),
]
