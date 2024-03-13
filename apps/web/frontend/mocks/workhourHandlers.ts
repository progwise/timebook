import { format } from 'date-fns'

import { mockWorkHoursQuery, WorkHoursQuery } from './mocks.generated'
import { testWorkHour } from './testData'

const workHours: WorkHoursQuery['workHours'] = [{ ...testWorkHour, date: format(new Date(), 'yyyy-MM-dd') }]

export const workHourHandlers = [
  mockWorkHoursQuery((_request, response, context) => {
    return response(
      context.data({
        __typename: 'Query',
        workHours,
      }),
    )
  }),
]
