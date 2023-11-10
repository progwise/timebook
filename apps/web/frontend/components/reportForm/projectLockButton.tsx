import { BiLock, BiLockOpen } from 'react-icons/bi'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { graphql } from '../../generated/gql'
import { ReportProjectFragment } from '../../generated/gql/graphql'

const ProjectLockMutationDocument = graphql(`
  mutation projectLock($date: MonthInput!, $projectId: ID!) {
    projectLock(date: $date, projectId: $projectId) {
      isLocked(date: $date)
    }
  }
`)

const ProjectUnlockMutationDocument = graphql(`
  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {
    projectUnlock(date: $date, projectId: $projectId) {
      isLocked(date: $date)
    }
  }
`)

interface ProjectLockButtonProps {
  year: number
  month: number
  project: ReportProjectFragment
}

export const ProjectLockButton = ({ year, month, project }: ProjectLockButtonProps) => {
  const [{ fetching: lockFetching }, lockReport] = useMutation(ProjectLockMutationDocument)
  const [{ fetching: unlockFetching }, unlockReport] = useMutation(ProjectUnlockMutationDocument)

  const variables = { date: { year: year, month: month }, projectId: project.id }

  const handleClick = () => {
    project.isLocked ? unlockReport(variables) : lockReport(variables)
  }

  const fetching = lockFetching || unlockFetching

  return (
    <button onClick={handleClick} disabled={fetching} className="btn btn-md">
      {project.isLocked ? <BiLockOpen /> : <BiLock />}
      {project.isLocked ? `Unlock` : `Lock`}
    </button>
  )
}
