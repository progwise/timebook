import { ChangeEventHandler } from 'react'

import { Spinner } from '@progwise/timebook-ui'

import { useReportLockMutation, useReportUnlockMutation } from '../../generated/graphql'

interface ReportLockButtonProps {
  userId: string
  projectId: string
  year: number
  month: number
  isLocked: boolean
}

export const ReportLockButton = ({ isLocked, year, month, projectId, userId }: ReportLockButtonProps) => {
  const [{ fetching: lockFetching }, lockReport] = useReportLockMutation()
  const [{ fetching: unlockFetching }, unlockReport] = useReportUnlockMutation()

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
