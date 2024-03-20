import { useRef } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6'

import { WorkHoursSheet } from './timeSheetView/workHoursSheet'

export const WorkHourComment = (): JSX.Element => {
  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

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
          {/*<div>
            <table>
              <thead>
                <tr>
                  <th>placeholder</th>
                </tr>
              </thead>
              <tbody>
                <div>placeholder</div>
              </tbody>
            </table>
          </div> */}
          <WorkHoursSheet />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
