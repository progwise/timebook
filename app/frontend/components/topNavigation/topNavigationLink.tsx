import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface TopNavigationLinkProps {
  href?: string
  onClick?: () => void
  children: ReactNode
}

export const TopNavigationLink = (props: TopNavigationLinkProps): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug as string

  let classNames = 'mx-3 my-3 bg-transparent  py-1 px-4 font-semibold'

  classNames =
    props.href && router.pathname.replace('[teamSlug]', teamSlug).startsWith(props.href)
      ? classNames + ' cursor-default text-blue-400 border-b-2 border-blue-400 '
      : classNames + ' cursor-pointer text-blue-400 hover:text-blue-500 hover:border-b-2 hover:border-blue-300  '

  if (props.href) {
    return (
      <Link href={props.href} passHref>
        <span className={classNames}>{props.children}</span>
      </Link>
    )
  }

  return (
    <span className={classNames} onClick={props.onClick}>
      {props.children}
    </span>
  )
}
