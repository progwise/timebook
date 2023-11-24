import { useState } from 'react'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { ArchiveProjectModal } from './archiveProjectModal'
import { DeleteProjectModal } from './deleteProjectModal'
import { UnarchiveProjectModal } from './unarchiveProjectModal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  if (project.isArchived) {
    return (
      <>
        <button className="btn btn-outline btn-sm" type="button" onClick={handleClick} disabled={props.disabled}>
          Unarchive
        </button>
        <UnarchiveProjectModal open={isModalOpen} onClose={handleClose} project={project} />
      </>
    )
  }

  if (project.hasWorkHours) {
    return (
      <>
        <button className="btn btn-outline btn-sm" type="button" onClick={handleClick} disabled={props.disabled}>
          Archive
        </button>
        <ArchiveProjectModal open={isModalOpen} onClose={handleClose} project={project} />
      </>
    )
  }

  return (
    <>
      <button className="btn btn-outline btn-sm" type="button" onClick={handleClick} disabled={props.disabled}>
        Delete
      </button>
      <DeleteProjectModal open={isModalOpen} onClose={handleClose} project={project} />
    </>
  )
}
