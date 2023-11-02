import { parseISO } from 'date-fns'
import { useState } from 'react'
import { useRef } from 'react'
import { BiBlock, BiPlay, BiSave } from 'react-icons/bi'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { LiveDuration } from '../liveDuration/liveDuration'
import { Modal } from '../modal'

const TrackingButtonsTrackingFragment = graphql(`
  fragment TrackingButtonsTracking on Tracking {
    start
    task {
      id
      title
      project {
        title
      }
    }
  }
`)

const TrackingButtonsTaskFragment = graphql(`
  fragment TrackingButtonsTask on Task {
    id
    isLocked
  }
`)

const TrackingStartMutationDocument = graphql(`
  mutation trackingStart($taskId: ID!) {
    trackingStart(taskId: $taskId) {
      start
      task {
        id
      }
    }
  }
`)

const TrackingStopMutationDocument = graphql(`
  mutation trackingStop {
    trackingStop {
      id
      task {
        id
      }
    }
  }
`)

const TrackingCancelMutationDocument = graphql(`
  mutation trackingCancel {
    trackingCancel {
      start
      task {
        id
      }
    }
  }
`)

interface TrackingButtonsProps {
  tracking?: FragmentType<typeof TrackingButtonsTrackingFragment> | null
  taskToTrack?: FragmentType<typeof TrackingButtonsTaskFragment> | null
}

export const TrackingButtons = (props: TrackingButtonsProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const tracking = useFragment(TrackingButtonsTrackingFragment, props.tracking)
  const taskToTrack = useFragment(TrackingButtonsTaskFragment, props.taskToTrack)
  const [, startTracking] = useMutation(TrackingStartMutationDocument)
  const [, stopTracking] = useMutation(TrackingStopMutationDocument)
  const [, cancelTracking] = useMutation(TrackingCancelMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

  if (tracking) {
    const start = parseISO(tracking.start)

    return (
      <>
        <div className="flex items-center gap-2">
          <button className="btn btn-square btn-success btn-xs" onClick={() => stopTracking({})}>
            <BiSave />
          </button>
          <button className="btn btn-square btn-error btn-xs" onClick={openDialog}>
            <BiBlock />
          </button>
        </div>
        <dialog className="modal" id="my_modal_2" ref={dialogReference}>
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete Tracking</h3>
            <p className="py-4">
              Do you want to delete <LiveDuration start={start} /> tracking on {tracking.task.title} (
              {tracking.task.project.title})?
            </p>
            <div className="flex flex-col flex-wrap gap-4 self-end sm:flex-row sm:justify-end">
              <form method="dialog">
                <button className="btn btn-sm shadow-lg">Cancel</button>
              </form>
              <button
                className="btn btn-error btn-sm shadow-lg"
                onClick={async () => {
                  await cancelTracking({})
                  dialogReference.current?.close()
                }}
              >
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

  if (taskToTrack) {
    return (
      <button
        className="btn btn-square btn-primary btn-outline btn-xs"
        onClick={() => startTracking({ taskId: taskToTrack.id })}
        //disabled={taskToTrack.isLocked}
      >
        <BiPlay />
      </button>
    )
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}
