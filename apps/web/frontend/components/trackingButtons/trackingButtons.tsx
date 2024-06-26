import { parseISO } from 'date-fns'
import { useRef } from 'react'
import { FaCheck, FaPlay, FaXmark } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Clock } from '../clock/clock'
import { LiveDuration } from '../liveDuration/liveDuration'

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
  interactiveButtons?: boolean
}

export const TrackingButtons = (props: TrackingButtonsProps) => {
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
        {props.interactiveButtons ? (
          <>
            <div className="flex items-center gap-2">
              <button className="btn btn-square btn-error btn-xs" onClick={openDialog}>
                <FaXmark />
              </button>
              <button className="btn btn-square btn-success btn-xs" onClick={() => stopTracking({})}>
                <FaCheck />
              </button>
            </div>
            <dialog className="modal text-base-content" ref={dialogReference}>
              <div className="modal-box">
                <h3 className="text-lg font-bold">Delete Tracking</h3>
                <p className="py-4">
                  Do you want to delete <LiveDuration start={start} /> tracking on {tracking.task.title} (
                  {tracking.task.project.title})?
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-ghost btn-sm">Cancel</button>
                  </form>
                  <button
                    className="btn btn-error btn-sm"
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
        ) : (
          <div className="flex justify-center">
            <Clock />
          </div>
        )}
      </>
    )
  }

  if (taskToTrack) {
    return (
      <button
        className="btn btn-square btn-outline btn-primary btn-xs pl-0.5"
        onClick={() => startTracking({ taskId: taskToTrack.id })}
        disabled={taskToTrack.isLocked}
      >
        <FaPlay />
      </button>
    )
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}
