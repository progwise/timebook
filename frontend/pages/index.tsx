import Head from 'next/head'
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Home() {
  const router = useRouter()

  const reroute = async () => router.push('/home')
  useEffect(() => {
      reroute().then()
    }, []
  );

  return (
    <>
    </>
  )
}
