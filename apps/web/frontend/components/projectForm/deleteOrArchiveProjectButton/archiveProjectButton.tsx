import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const ArchiveProjectButtonFragment = graphql(`
  fragment ArchiveProjectButton on Project {
    id
    title
  }
`)

const ProjectArchiveMutationDocument = graphql(`
  mutation projectArchive($projectId: ID!) {
    projectArchive(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

interface ArchiveProjectButtonProps {
  project: FragmentType<typeof ArchiveProjectButtonFragment>
}

export const ArchiveProjectButton = ({ project: projectFragment }: ArchiveProjectButtonProps): JSX.Element => {
  const project = useFragment(ArchiveProjectButtonFragment, projectFragment)
  const [{ fetching }, projectArchive] = useMutation(ProjectArchiveMutationDocument)
  const router = useRouter()

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleArchiveProject = async () => {
    try {
      await projectArchive({ projectId: project.id })
      await router.push('/projects')
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button className="btn btn-secondary btn-sm" type="button" onClick={() => dialogReference.current?.showModal()}>
        Archive
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Archive project</h3>
          <p className="py-4">Are you sure you want to archive project {project.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleArchiveProject} disabled={fetching}>
              Archive
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
