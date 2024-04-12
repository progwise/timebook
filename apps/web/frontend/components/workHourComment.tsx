import { useRef } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const WorkHourCommentFragment = graphql(`
  fragment WorkHourCommentFragment on Task {
    title
    workHourOfDays(from: $from, to: $to) {
      date
      workHour {
        id
        comment
      }
    }
  }
`)

interface WorkHourCommentProps {
  comment: FragmentType<typeof WorkHourCommentFragment>
}

export const WorkHourComment = ({ comment: commentFragment }: WorkHourCommentProps) => {
  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

  const comment = useFragment(WorkHourCommentFragment, commentFragment)

  return (
    <>
      <div>
        <button className="btn btn-square btn-info btn-xs" title="Comments" onClick={openDialog}>
          <FaRegCommentDots />
        </button>
      </div>

      <dialog className="modal text-base-content" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Comments</h3>
          <div>
            {comment.workHourOfDays.map((workHourOfDay) => (
              <div key={workHourOfDay.workHour?.id}>{workHourOfDay.workHour?.comment}</div>
            ))}
          </div>
          {/* <WorkHoursSheet /> */}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
