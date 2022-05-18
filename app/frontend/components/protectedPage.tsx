import { ReactNode } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { TimebookPage } from './timebookPage'

interface ProtectedPageProps {
  children?: ReactNode
}

export const ProtectedPage = (props: ProtectedPageProps): JSX.Element => {
  const session = useSession({
    required: true,
    onUnauthenticated: () => signIn('github'),
  })

  if (session.status === 'authenticated') {
    return <TimebookPage>{props.children}</TimebookPage>
  }

  return <></>
}
