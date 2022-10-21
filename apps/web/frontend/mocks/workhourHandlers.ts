import { mockWorkHourCreateMutation, mockWorkHoursQuery, WorkHourFragment } from '../generated/graphql'
import { testProject1, testTask2, testWorkHour } from './testData'

const workHours: WorkHourFragment[] = [testWorkHour]

export const workhourHandlers = [
  mockWorkHoursQuery((request, response, context) => {
    return response(
      context.data({
        __typename: 'Query',
        workHours,
      }),
    )
  }),
  mockWorkHourCreateMutation((request, response, context) => {
    const newWorkHour: WorkHourFragment = {
      __typename: 'WorkHour',
      date: request.variables.data.date,
      duration: request.variables.data.duration,
      id: 'newWorkHour',
      project: testProject1,
      task: testTask2,
      user: { __typename: 'User', id: 'User1' },
    }
    workHours.push(newWorkHour)
    return response(
      context.data({
        __typename: 'Mutation',
        workHourCreate: newWorkHour,
      }),
    )
  }),
]
