import { parseISO } from 'date-fns'
import { useState } from 'react'
import { BiBlock, BiPause, BiPlay } from 'react-icons/bi'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

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

  if (tracking) {
    const start = parseISO(tracking.start)

    return (
      <>
        <Button variant="primary" onClick={() => stopTracking({})}>
          <BiPause />
        </Button>
        <Button variant="danger" onClick={() => setIsCancelModalOpen(true)}>
          <BiBlock />
        </Button>
        {isCancelModalOpen && (
          <Modal
            title="Delete Tracking"
            actions={
              <>
                <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    await cancelTracking({})
                    setIsCancelModalOpen(false)
                  }}
                >
                  Delete
                </Button>
              </>
            }
          >
            Do you want to delete <LiveDuration start={start} /> tracking on {tracking.task.title} (
            {tracking.task.project.title})?
          </Modal>
        )}
      </>
    )
  }

  if (taskToTrack) {
    return (
      <Button
        variant="secondary"
        onClick={() => startTracking({ taskId: taskToTrack.id })}
        disabled={taskToTrack.isLocked}
      >
        <BiPlay />
      </Button>
    )
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}
