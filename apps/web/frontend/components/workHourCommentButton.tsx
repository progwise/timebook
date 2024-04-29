import { format, max, min, parseISO } from 'date-fns'
import { useRef } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { toastError } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const WorkHourCommentFragment = graphql(`
  fragment WorkHourCommentFragment on Task {
    id
    title
    workHourOfDays(from: $from, to: $to) {
      date
      workHour {
        comment
      }
      isLocked
    }
  }
`)

interface WorkHourCommentProps {
  task: FragmentType<typeof WorkHourCommentFragment>
}

const CommentUpdateMutationDocument = graphql(`
  mutation commentUpdate($comment: String!, $date: Date!, $taskId: ID!) {
    workHourCommentUpdate(date: $date, taskId: $taskId, comment: $comment) {
      comment
    }
  }
`)

export const WorkHourComment = ({ task: commentFragment }: WorkHourCommentProps) => {
  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

  const task = useFragment(WorkHourCommentFragment, commentFragment)
  const [, commentUpdate] = useMutation(CommentUpdateMutationDocument)
  const handleBlur = (date: string) => async (event: React.FocusEvent<HTMLTextAreaElement>) => {
    try {
      const result = await commentUpdate({
        comment: event.target.value,
        date,
        taskId: task.id,
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
    } catch {
      toastError('Error, comment was not saved')
    }
  }

  const allDays = task.workHourOfDays.map((workHourOfDay) => parseISO(workHourOfDay.date))
  const firstDay = min(allDays)
  const lastDay = max(allDays)
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' })

  const commentCount = task.workHourOfDays.filter((workHourOfDay) => workHourOfDay.workHour?.comment).length

  return (
    <>
      <div className="indicator">
        {commentCount > 0 && (
          <span
            className="badge indicator-item badge-secondary badge-xs"
            title={commentCount === 1 ? `1 comment` : `${commentCount} comments`}
          >
            {commentCount}
          </span>
        )}
        <button className="btn btn-square btn-outline btn-xs" title="Comments" onClick={openDialog}>
          <FaRegCommentDots />
        </button>
      </div>

      <dialog className="modal text-base-content" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="pb-3 text-lg font-bold">
            Comments for {task.title} ({dateTimeFormat.formatRange(firstDay, lastDay)})
          </h3>
          <div className="flex flex-col gap-2">
            {task.workHourOfDays.map((workHourOfDay) => {
              const date = parseISO(workHourOfDay.date)
              return (
                <div key={workHourOfDay.date}>
                  <div className="flex items-center justify-between rounded-box py-1">
                    {format(date, 'EEEE, MMMM do')}
                  </div>
                  <textarea
                    title="comment"
                    defaultValue={workHourOfDay.workHour?.comment ?? undefined}
                    rows={3}
                    className="textarea textarea-sm w-full resize-none bg-base-200 leading-relaxed enabled:hover:textarea-bordered"
                    onBlur={handleBlur(workHourOfDay.date)}
                    disabled={workHourOfDay.isLocked}
                  />
                </div>
              )
            })}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary btn-sm">Close</button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
