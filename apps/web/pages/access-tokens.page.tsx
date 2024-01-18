/* eslint-disable unicorn/filename-case */
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import { useMutation, useQuery } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { FragmentType, graphql, useFragment } from '../frontend/generated/gql'

const DeleteAccessTokenButtonFragment = graphql(`
  fragment DeleteAccessTokenButton on AccessToken {
    id
    name
  }
`)

const AccessTokensQueryDocument = graphql(`
  query accessTokens {
    accessTokens {
      createdAt
      id
      name
    }
  }
`)

const AccessTokenDeleteMutationDocument = graphql(`
  mutation accessTokenDelete($id: ID!) {
    accessTokenDelete(id: $id) {
      id
    }
  }
`)

const AccessTokenCreateMutationDocument = graphql(`
  mutation accessTokenCreate($data: AccessTokenInput!) {
    accessTokenCreate(data: $data)
  }
`)

export interface DeleteAccessTokenButtonProps {
  accessToken: FragmentType<typeof DeleteAccessTokenButtonFragment>
}

export type AccessTokenFormData = Pick<AccessTokenInput, 'name'>

const AccessTokensPage = ({ accessToken: accessTokenFragment }: DeleteAccessTokenButtonProps): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['AccessToken'] }), [])
  const [{ data, error, fetching: accessTokensLoading }] = useQuery({
    query: AccessTokensQueryDocument,
    context,
  })
  const accessToken = useFragment(DeleteAccessTokenButtonFragment, accessTokenFragment)
  const { register, handleSubmit, formState } = useForm<AccessTokenFormData>()
  const [{ fetching }, accessTokenDelete] = useMutation(AccessTokenDeleteMutationDocument)

  const { isSubmitting, errors, isDirty, dirtyFields } = formState

  const [, accessTokenCreate] = useMutation(AccessTokenCreateMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' })

  const handleDeleteAccessToken = async () => {
    try {
      await accessTokenDelete({ id: accessToken.id })
    } catch {}
    dialogReference.current?.close()
  }

  const handleCreateAccessToken = async (accessTokenData: AccessTokenFormData) => {
    try {
      const result = await accessTokenCreate({
        data: {
          ...accessTokenData,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
      reset()
    } catch {}
  }

  return (
    <ProtectedPage>
      <PageHeading>Access Tokens</PageHeading>
      {error && <span>{error.message}</span>}
      {accessTokensLoading && <span className="loading loading-spinner" />}
      {data && (
        <div className=" rounded-box border border-base-content/50 shadow-lg">
          <table className="table min-w-full">
            <thead className="text-xl text-base-content">
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th className="w-px" />
              </tr>
            </thead>
            <tbody>
              {data?.accessTokens.map((accessToken) => {
                const createdAt = parseISO(accessToken.createdAt)
                return (
                  <tr key={accessToken.id}>
                    <td>{accessToken.name}</td>
                    <td title={dateTimeFormat.format(createdAt)}>{formatDistanceToNow(createdAt)} ago</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm btn-block"
                        aria-label="Delete the access token"
                        title="Delete the access token"
                        onClick={() => dialogReference.current?.showModal()}
                      >
                        <BiTrash />
                      </button>
                      <dialog className="modal" ref={dialogReference}>
                        <div className="modal-box">
                          <h3 className="text-lg font-bold">Delete access token</h3>
                          <p className="py-4">Are you sure you want to delete {accessToken.name}?</p>
                          <div className="modal-action">
                            <form method="dialog">
                              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                                Cancel
                              </button>
                            </form>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={handleDeleteAccessToken}
                              disabled={fetching}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="font-normal">
                <td>
                  <form onSubmit={handleSubmit(handleCreateAccessToken)} id="form-create-access-token">
                    <InputField
                      type="text"
                      placeholder="Enter a new access token name"
                      {...register('name')}
                      errorMessage={errors.name?.message}
                      isDirty={isDirty && dirtyFields.name}
                    />
                  </form>
                </td>
                <td />
                <td>
                  <button
                    className="btn btn-primary btn-sm w-full"
                    type="submit"
                    disabled={isSubmitting}
                    form="form-create-access-token"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </ProtectedPage>
  )
}

export default AccessTokensPage
