import { mockWorkHoursQuery } from '../generated/graphql'
import { testWorkHour } from './testData'

export const workhourHandlers = [
  mockWorkHoursQuery((request, response, context) =>
    response(
      context.data({
        __typename: 'Query',
        workHours: [testWorkHour],
      }),
    ),
  ),
]
