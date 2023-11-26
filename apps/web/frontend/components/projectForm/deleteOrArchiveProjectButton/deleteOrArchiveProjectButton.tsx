import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { ArchiveProjectButton } from './archiveProjectButton'
import { DeleteProjectButton } from './deleteProjectButton'
import { UnarchiveProjectButton } from './unarchiveProjectButton'

export const DeleteOrArchiveProjectButtonFragment = graphql(`
  fragment DeleteOrArchiveProjectButton on Project {
    id
    hasWorkHours
    isArchived
    ...DeleteProjectModal
    ...UnarchiveProjectModal
    ...ArchiveProjectModal
  }
`)

interface DeleteOrArchiveProjectButtonProps {
  project: FragmentType<typeof DeleteOrArchiveProjectButtonFragment>
  disabled: boolean
}

export const DeleteOrArchiveProjectButton = (props: DeleteOrArchiveProjectButtonProps) => {
  const project = useFragment(DeleteOrArchiveProjectButtonFragment, props.project)

  if (project.isArchived) {
    return <UnarchiveProjectButton project={project} />
  }

  if (project.hasWorkHours) {
    return <ArchiveProjectButton project={project} />
  }

  return <DeleteProjectButton project={project} />
}
