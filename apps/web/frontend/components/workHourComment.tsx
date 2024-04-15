import { zodResolver } from '@hookform/resolvers/zod'
import { format, isEqual, parseISO } from 'date-fns'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegCommentDots } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'
import { workHourInputValidations } from '@progwise/timebook-validations'

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

const CommentCreateMutationDocument = graphql(`
  mutation commentCreate($comment: String!, $date: Date!, $taskId: ID!, $duration: Int!) {
    workHourUpdate(
      data: { comment: $comment, date: $date, duration: $duration, taskId: $taskId }
      date: $date
      taskId: $taskId
    ) {
      comment
    }
  }
`)

export const WorkHourComment = ({ comment: commentFragment }: WorkHourCommentProps) => {
  const dialogReference = useRef<HTMLDialogElement>(null)
  const openDialog = () => {
    dialogReference.current?.showModal()
  }

  const comment = useFragment(WorkHourCommentFragment, commentFragment)

  console.log(comment)
  const context = useMemo(() => ({ additionalTypenames: ['Comment'] }), [])
  const { register, handleSubmit, formState, reset } = useForm<{ comment: string }>({
    resolver: zodResolver(workHourInputValidations),
  })

  const { isSubmitting, errors, isDirty, dirtyFields } = formState
  const [, commentCreate] = useMutation(CommentCreateMutationDocument)

  // const handleCreateComment = async ({ comment }: { comment: string }) => {
  //   try {
  //     const result = await commentCreate(
  //       {
  //         comment,
  //       },
  //       context,
  //     )
  //     if (result.error) {
  //       throw new Error(`GraphQL Error ${result.error}`)
  //     }
  //     reset()
  //   } catch {}
  // }

  const [openCommentDate, setOpenCommentDate] = useState<Date | undefined>()
  console.log(openCommentDate)

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
          <div className="flex flex-col gap-2">
            {comment?.workHourOfDays.map((workHourOfDay) => {
              const date = parseISO(workHourOfDay.date)
              const isOpen = openCommentDate && isEqual(openCommentDate, date)
              const hasComment = !!workHourOfDay.workHour?.comment
              return (
                <div key={workHourOfDay.date}>
                  <div className="flex items-center justify-between rounded-box   py-1">
                    {format(date, 'EEEE, MMMM do')}
                    {/* {isOpen ? (
                      <button className="btn btn-primary btn-sm">Save</button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setOpenCommentDate(date)
                        }}
                      >
                        Edit
                      </button>
                    )} */}
                  </div>
                  {/* {workHourOfDay.workHour?.comment ? (
                  <div>{workHourOfDay.workHour.comment}</div>
                ) : (
                  <div className="h-5" />
                )}
                {openCommentDate && isEqual(openCommentDate, parseISO(workHourOfDay.date)) && <InputField />} */}
                  {/* {!isOpen && !hasComment ? (
                    <div className="h-5" />
                  ) : ( */}
                  <input
                    // readOnly={!isOpen}
                    defaultValue={workHourOfDay.workHour?.comment ?? undefined}
                    className="input input-sm w-full bg-base-200 hover:input-bordered"
                  />
                  {/* )} */}
                </div>
              )
            })}
          </div>
          <div className="flex">
            <div>
              <form id="form-create-comment">
                <InputField
                  type="text"
                  placeholder="Enter a new comment"
                  {...register('comment')}
                  errorMessage={errors.comment?.message}
                  isDirty={isDirty && dirtyFields.comment}
                />
              </form>
            </div>
            <div>
              <button
                className="btn btn-primary btn-sm"
                type="submit"
                disabled={isSubmitting}
                form="form-create-comment"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
