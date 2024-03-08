import { FaPlay, FaRegClock } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const TrackingButtonTrackingFragment = graphql(`
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

const TrackingButtonTaskFragment = graphql(`
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

interface TrackingButtonProps {
  tracking?: FragmentType<typeof TrackingButtonTrackingFragment> | null
  taskToTrack?: FragmentType<typeof TrackingButtonTaskFragment> | null
}

export const TrackingButton = (props: TrackingButtonProps) => {
  const tracking = useFragment(TrackingButtonTrackingFragment, props.tracking)
  const taskToTrack = useFragment(TrackingButtonTaskFragment, props.taskToTrack)
  const [, startTracking] = useMutation(TrackingStartMutationDocument)

  if (tracking) {
    return (
      <div className="flex justify-center">
        <FaRegClock />
      </div>
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
