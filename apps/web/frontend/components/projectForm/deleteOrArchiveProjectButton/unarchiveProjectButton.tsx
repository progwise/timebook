import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const UnarchiveProjectButtonFragment = graphql(`
  fragment UnarchiveProjectButton on Project {
    id
    title
  }
`)

const ProjectUnarchiveMutationDocument = graphql(`
  mutation projectUnarchive($projectId: ID!) {
    projectUnarchive(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

interface UnarchiveProjectButtonProps {
  project: FragmentType<typeof UnarchiveProjectButtonFragment>
}

export const UnarchiveProjectButton = ({ project: projectFragment }: UnarchiveProjectButtonProps): JSX.Element => {
  const project = useFragment(UnarchiveProjectButtonFragment, projectFragment)
  const [{ fetching }, projectUnarchive] = useMutation(ProjectUnarchiveMutationDocument)
  const router = useRouter()

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleUnarchiveProject = async () => {
    try {
      await projectUnarchive({ projectId: project.id })
      await router.push('/projects')
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button className="btn btn-outline btn-sm" type="button" onClick={() => dialogReference.current?.showModal()}>
        Unarchive
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Unarchive project</h3>
          <p className="py-4">Are you sure you want to unarchive project {project.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleUnarchiveProject} disabled={fetching}>
              Unarchive
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
