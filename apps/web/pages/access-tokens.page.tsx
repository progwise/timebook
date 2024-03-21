/* eslint-disable unicorn/filename-case */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BiCopyAlt } from 'react-icons/bi'
import { useMutation, useQuery } from 'urql'

import { InputField, toastSuccess } from '@progwise/timebook-ui'
import { accessTokenInputValidations } from '@progwise/timebook-validations'

import { AccessTokenRow } from '../frontend/components/accessToken/accessTokenRow'
import { Clock } from '../frontend/components/clock/clock'
import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { graphql } from '../frontend/generated/gql'

const AccessTokensQueryDocument = graphql(`
  query accessTokens {
    accessTokens {
      id
      ...AccessTokenRow
    }
  }
`)

const AccessTokenCreateMutationDocument = graphql(`
  mutation accessTokenCreate($name: String!) {
    accessTokenCreate(name: $name)
  }
`)

const AccessTokensPage = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['AccessToken'] }), [])
  const [{ data, error, fetching: accessTokensLoading }] = useQuery({
    query: AccessTokensQueryDocument,
    context,
  })
  const { register, handleSubmit, formState, reset } = useForm<{ name: string }>({
    resolver: zodResolver(accessTokenInputValidations),
  })
  const dialogReference = useRef<HTMLDialogElement>(null)

  const { isSubmitting, errors, isDirty, dirtyFields } = formState

  const [{ data: tokenCreateData, fetching }, accessTokenCreate] = useMutation(AccessTokenCreateMutationDocument)

  const handleCreateAccessToken = async ({ name }: { name: string }) => {
    try {
      const result = await accessTokenCreate(
        {
          name,
        },
        context,
      )
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
      reset()
      dialogReference.current?.showModal()
    } catch {}
  }

  return (
    <ProtectedPage>
      <Clock />
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
              {data?.accessTokens.map((accessToken) => (
                <AccessTokenRow accessToken={accessToken} key={accessToken.id} />
              ))}
            </tbody>
            <tfoot>
              <tr className="font-normal">
                <td colSpan={2}>
                  <form onSubmit={handleSubmit(handleCreateAccessToken)} id="form-create-access-token">
                    <InputField
                      type="text"
                      placeholder="Enter a new access token name"
                      {...register('name')}
                      errorMessage={errors.name?.message}
                      isDirty={isDirty && dirtyFields.name}
                      label="access token name"
                      hideLabel
                    />
                  </form>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    type="submit"
                    disabled={isSubmitting}
                    form="form-create-access-token"
                  >
                    Add
                  </button>
                  <dialog className="modal" ref={dialogReference}>
                    <div className="modal-box whitespace-normal text-base-content">
                      <h3 className="mb-4 text-lg font-bold">New access token</h3>
                      <div className="text-base">
                        <p>Here is the new access token:</p>
                        <div className="my-2 flex items-center">
                          <input
                            className="input input-bordered grow bg-neutral py-2 text-neutral-content"
                            value={tokenCreateData?.accessTokenCreate ?? ''}
                            readOnly
                          />
                          <button
                            className="btn btn-circle btn-ghost gap-2 text-xl"
                            onClick={() => {
                              navigator.clipboard.writeText(tokenCreateData?.accessTokenCreate ?? '')
                              toastSuccess('Successfully copied to clipboard!')
                            }}
                          >
                            <BiCopyAlt />
                          </button>
                        </div>
                        <span>Warning: You will no longer be able to see it once you close this dialog window.</span>
                      </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn btn-ghost btn-sm" disabled={fetching}>
                            Done
                          </button>
                        </form>
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
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
