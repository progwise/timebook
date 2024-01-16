import { mockAccessTokensQuery } from './mocks.generated'

export const accessTokenHandlers = [
  mockAccessTokensQuery((_request, response, context) => {
    return response(
      context.data({
        __typename: 'Query',
        accessTokens: [
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
        ],
      }),
    )
  }),
]
