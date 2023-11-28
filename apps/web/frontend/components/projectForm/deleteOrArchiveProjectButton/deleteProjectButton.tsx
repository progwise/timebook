import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const DeleteProjectModalFragment = graphql(`
  fragment DeleteProjectModal on Project {
    id
    title
  }
`)

const ProjectDeleteMutationDocument = graphql(`
  mutation projectDelete($id: ID!) {
    projectDelete(id: $id) {
      id
    }
  }
`)

interface DeleteProjectButtonProps {
  project: FragmentType<typeof DeleteProjectModalFragment>
}

export const DeleteProjectButton = ({ project: projectFragment }: DeleteProjectButtonProps): JSX.Element => {
  const project = useFragment(DeleteProjectModalFragment, projectFragment)
  const [{ fetching }, projectDelete] = useMutation(ProjectDeleteMutationDocument)
  const router = useRouter()

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleDeleteProject = async () => {
    try {
      await projectDelete({ id: project.id })
      await router.push('/projects')
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button className="btn btn-outline btn-sm" type="button" onClick={() => dialogReference.current?.showModal()}>
        Delete
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete project</h3>
          <p className="py-4">Are you sure you want to delete {project.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-error btn-sm" onClick={handleDeleteProject} disabled={fetching}>
              Delete
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
