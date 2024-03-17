import { useMemo, useRef } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { FragmentType, graphql } from '../generated/gql'

const WorkHourCommentsQueryDocument = graphql(`
  query workHourComments($from: Date!, $to: Date) {
    workHours(from: $from, to: $to) {
      id
      comment
      date
      duration
    }
  }
`)

const WorkHourCommentFragment = graphql(`
  fragment WorkHourComment on WorkHour {
    id
    date
    duration
    comment
  }
`)

interface WorkHourCommentProps {
  workHourComment: FragmentType<typeof WorkHourCommentFragment>
}

export const WorkHourComment = (props: WorkHourCommentProps) => {
  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

  const context = useMemo(() => ({ additionalTypenames: ['WorkHourComment'] }), [])
  const [{ data, error, fetching: workHourCommentsLoading }] = useQuery({
    query: WorkHourCommentsQueryDocument,
    context,
  })

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
          {error && <span>{error.message}</span>}
          {workHourCommentsLoading && <span className="loading loading-spinner" />}
          {data && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>placeholder</th>
                  </tr>
                </thead>
                <tbody>{data?.workHours.map((WorkHourComment) => <div key={WorkHourComment.id}>123</div>)}</tbody>
              </table>
            </div>
          )}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
