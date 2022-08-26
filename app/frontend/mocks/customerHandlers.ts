import { mockCustomersQuery, mockCustomerCreateMutation, CustomerFragment } from '../generated/graphql'

const customers: CustomerFragment[] = [
  {
    id: 'customer1',
    title: 'Customer 1',
    __typename: 'Customer',
  },
  {
    id: 'customer2',
    title: 'Customer 2',
    __typename: 'Customer',
  },
]

export const customerHandlers = [
  mockCustomersQuery((request, response, context) =>
    response(
      context.data({
        team: {
          id: 'team1',
          title: 'Progwise',
          customers,
          __typename: 'Team',
        },
        __typename: 'Query',
      }),
    ),
  ),
  mockCustomerCreateMutation((request, response, context) => {
    const newCustomer: CustomerFragment = {
      id: `customer${customers.length + 1}`,
      title: request.variables.data.title,
      __typename: 'Customer',
    }

    customers.push(newCustomer)

    return response(context.data({ customerCreate: newCustomer, __typename: 'Mutation' }))
  }),
]
