import { mockTaskCreateMutation, mockTaskDeleteMutation } from '../generated/graphql'

export const taskHandlers = [
  mockTaskDeleteMutation((request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskDelete: {
          id: '1',
          hasWorkHours: false,
          project: { id: 'ProjectId', title: 'Projects', __typename: 'Project' },
          title: 'Task 1',
          __typename: 'Task',
        },
      }),
    ),
  ),
  mockTaskCreateMutation((request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        taskCreate: {
          id: '1',
          hasWorkHours: false,
          project: {
            id: request.variables.data.projectId,
            title: 'Project A',
            __typename: 'Project',
          },
          title: request.variables.data.title,
          __typename: 'Task',
        },
      }),
    ),
  ),
]
