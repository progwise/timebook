import { mockCustomersQuery } from '../generated/graphql'

export const customerHandlers = [
  mockCustomersQuery((request, response, context) =>
    response(
      context.data({
        team: {
          id: 'team1',
          title: 'Progwise',
          customers: [
            {
              id: 'customer1',
              title: 'Customer 1',
            },
            {
              id: 'customer2',
              title: 'Customer 2',
            },
          ],
        },
      }),
    ),
  ),
]
