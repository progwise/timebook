import { signIn, useSession } from 'next-auth/react'

const ProtectedPage = (): JSX.Element | undefined => {
    const session = useSession()

    if (session.status === 'unauthenticated') {
        signIn()
        return undefined
    }

    return (
        <div>
            <h1>Protected Page</h1>
            <p>{JSON.stringify(session)}</p>
        </div>
    )
}

export default ProtectedPage
