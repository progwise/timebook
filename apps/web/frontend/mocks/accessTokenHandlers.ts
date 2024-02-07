import { mockAccessTokensQuery, mockAccessTokenCreateMutation } from './mocks.generated'

const accessTokens = [
  {
    id: '1',
    name: 'A1',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'A2',
    createdAt: '2024-01-02',
  },
]

export const accessTokenHandlers = [
  mockAccessTokensQuery((_request, response, context) => {
    return response(
      context.data({
        __typename: 'Query',
        accessTokens,
      }),
    )
  }),
  mockAccessTokenCreateMutation((request, response, context) => {
    accessTokens.push({
      id: (accessTokens.length + 1).toString(),
      name: request.variables.name,
      createdAt: '2024-01-03',
    })
    return response(
      context.data({
        __typename: 'Mutation',
        accessTokenCreate: 'eb0e9392-b08f-4d09-b7b9-b84909fca67b',
      }),
    )
  }),
]
