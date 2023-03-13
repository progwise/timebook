import { ChangeEventHandler } from 'react'
import { useMutation } from 'urql'

import { Spinner } from '@progwise/timebook-ui'

import { graphql } from '../../generated/gql'

const ReportLockMutationDocument = graphql(`
  mutation reportLock($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    reportLock(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
  }
`)

const ReportUnlockMutationDocument = graphql(`
  mutation reportUnlock($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    reportUnlock(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
  }
`)

interface ReportLockButtonProps {
  userId: string
  projectId: string
  year: number
  month: number
  isLocked: boolean
}

export const ReportLockButton = ({ isLocked, year, month, projectId, userId }: ReportLockButtonProps) => {
  const [{ fetching: lockFetching }, lockReport] = useMutation(ReportLockMutationDocument)
  const [{ fetching: unlockFetching }, unlockReport] = useMutation(ReportUnlockMutationDocument)

  const variables = { year, month, projectId, userId }

  const handleClick: ChangeEventHandler<HTMLInputElement> = (event) =>
    event.target.checked ? lockReport(variables) : unlockReport(variables)

  const fetching = lockFetching || unlockFetching

  return (
    <label>
      <input type="checkbox" checked={isLocked} onChange={handleClick} disabled={fetching} /> Lock Report{' '}
      {fetching && <Spinner />}
    </label>
  )
}
