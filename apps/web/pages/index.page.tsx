import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home(): JSX.Element {
  const router = useRouter()

  const reroute = async () => router.push('/week')
  useEffect(() => {
    reroute().then()
  }, [])

  return <></>
}
