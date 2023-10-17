import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface TopNavigationLinkProps {
  href: string
  children: ReactNode
}

export const TopNavigationLink: React.FC<TopNavigationLinkProps> = ({ href, children }): JSX.Element => {
  const router = useRouter()

  return (
    <Link href={href} className={`btn btn-ghost normal-case ${router.asPath.startsWith(href) ? 'btn-active' : ''}`}>
      {children}
    </Link>
  )
}
