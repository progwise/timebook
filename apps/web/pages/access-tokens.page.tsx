/* eslint-disable unicorn/filename-case */
import { formatDistanceToNow, formatRelative, parseISO } from 'date-fns'
import { useMemo } from 'react'
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
  const context = useMemo(() => ({ additionalTypenames: ['AccessToken'] }), [])
  const [{ data, error, fetching: accessTokensLoading }] = useQuery({
    query: AccessTokensQueryDocument,
    context,
  })

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' })

  return (
    <ProtectedPage>
      <PageHeading>Access Tokens</PageHeading>
      {error && <span>{error.message}</span>}
      {accessTokensLoading && <span className="loading loading-spinner" />}
      {data && (
        <div className="w-full rounded-box border border-base-content/50 shadow-lg">
          <table className="table">
            <thead className="text-lg text-base-content">
              <tr>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {data?.accessTokens.map((accessToken) => {
                const createdAt = parseISO(accessToken.createdAt)
                return (
                  <tr key={accessToken.id}>
                    <td>{accessToken.name}</td>
                    <td title={dateTimeFormat.format(createdAt)}>{formatDistanceToNow(createdAt)} ago</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </ProtectedPage>
  )
}

export default AccessTokensPage
