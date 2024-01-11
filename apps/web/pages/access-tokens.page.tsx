/* eslint-disable unicorn/filename-case */
import { useQuery } from 'urql'

import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { graphql } from '../frontend/generated/gql'

const AccessTokensQueryDocument = graphql(`
  query accessTokens {
    accessTokens {
      createdAt
      id
      name
    }
  }
`)

const AccessTokensPage = (): JSX.Element => {
  const [{ data, error, fetching }] = useQuery({
    query: AccessTokensQueryDocument,
    // context,
  })
  return (
    <ProtectedPage>
      <PageHeading>Access Tokens</PageHeading>
      <ul>
        {data?.accessTokens.map((accessToken) => (
          <li key={accessToken.id}>
            {accessToken.name}, {accessToken.createdAt}
          </li>
        ))}
      </ul>
    </ProtectedPage>
  )
}

export default AccessTokensPage
