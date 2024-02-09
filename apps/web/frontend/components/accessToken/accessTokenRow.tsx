import { formatDistanceToNow, parseISO } from 'date-fns'
import { useRef } from 'react'
import { BiTrash } from 'react-icons/bi'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const AccessTokenRowFragment = graphql(`
  fragment AccessTokenRow on AccessToken {
    id
    name
    createdAt
  }
`)

const AccessTokenDeleteMutationDocument = graphql(`
  mutation accessTokenDelete($id: ID!) {
    accessTokenDelete(id: $id) {
      id
    }
  }
`)

interface AccessTokenProps {
  accessToken: FragmentType<typeof AccessTokenRowFragment>
}

const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' })

export const AccessTokenRow = (props: AccessTokenProps) => {
  const accessToken = useFragment(AccessTokenRowFragment, props.accessToken)
  const dialogReference = useRef<HTMLDialogElement>(null)
  const [{ fetching }, accessTokenDelete] = useMutation(AccessTokenDeleteMutationDocument)

  const handleDeleteAccessToken = async () => {
    try {
      await accessTokenDelete({ id: accessToken.id })
    } catch {}
    dialogReference.current?.close()
  }

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
              <button className="btn btn-error btn-sm" onClick={handleDeleteAccessToken} disabled={fetching}>
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
}
