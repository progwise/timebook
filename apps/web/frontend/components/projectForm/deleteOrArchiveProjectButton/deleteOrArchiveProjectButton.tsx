import { useState } from 'react'

import { Button } from '@progwise/timebook-ui'

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
}

export const DeleteOrArchiveProjectButton = (props: DeleteOrArchiveProjectButtonProps) => {
  const project = useFragment(DeleteOrArchiveProjectButtonFragment, props.project)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  if (project.isArchived) {
    return (
      <>
        <Button variant="tertiary" onClick={handleClick}>
          Unarchive
        </Button>
        <UnarchiveProjectModal open={isModalOpen} onClose={handleClose} project={project} />
      </>
    )
  }

  if (project.hasWorkHours) {
    return (
      <>
        <Button variant="tertiary" onClick={handleClick}>
          Archive
        </Button>
        <ArchiveProjectModal open={isModalOpen} onClose={handleClose} project={project} />
      </>
    )
  }

  return (
    <>
      <Button variant="tertiary" onClick={handleClick}>
        Delete
      </Button>
      <DeleteProjectModal open={isModalOpen} onClose={handleClose} project={project} />
    </>
  )
}
