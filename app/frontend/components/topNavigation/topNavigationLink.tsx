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
  let classNames = 'mx-3 my-3 bg-transparent text-indigo-500 font-semibold py-1 px-4 border border-indigo-300 rounded'
  classNames =
    props.href && router.pathname.startsWith(props.href)
      ? classNames + ' cursor-default text-indigo-900 border-indigo-900'
      : classNames + ' cursor-pointer hover:text-indigo-900 hover:border-indigo-900'

  if (props.href) {
    return (
      <Link href={props.href}>
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
