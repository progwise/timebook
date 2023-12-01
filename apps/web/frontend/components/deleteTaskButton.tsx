import { useRef } from 'react'
import { BiTrash } from 'react-icons/bi'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../generated/gql'

const DeleteTaskButtonFragment = graphql(`
  fragment DeleteTaskButton on Task {
    id
    hasWorkHours
    title
  }
`)

const TaskDeleteMutationDocument = graphql(`
  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {
    taskDelete(id: $id) @skip(if: $hasWorkHours) {
      id
    }
    taskArchive(taskId: $id) @include(if: $hasWorkHours) {
      id
    }
  }
`)

export interface DeleteTaskButtonProps {
  task: FragmentType<typeof DeleteTaskButtonFragment>
}

export const DeleteTaskButton = ({ task: taskFragment }: DeleteTaskButtonProps): JSX.Element => {
  const task = useFragment(DeleteTaskButtonFragment, taskFragment)
  const [{ fetching }, taskDelete] = useMutation(TaskDeleteMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleDeleteTask = async () => {
    try {
      await taskDelete({ id: task.id, hasWorkHours: task.hasWorkHours })
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-outline btn-sm btn-block"
        aria-label="Delete the task"
        title="Delete the task"
        onClick={() => dialogReference.current?.showModal()}
      >
        <BiTrash />
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete task</h3>
          <p className="py-4">Are you sure you want to delete {task.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-error btn-sm" onClick={handleDeleteTask} disabled={fetching}>
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
