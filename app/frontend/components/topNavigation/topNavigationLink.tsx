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
  let classNames = 'mx-3 my-3 py-1 px-5 font-semibold text-base'

  // transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:border-indigo-600 duration-300 py-1 px-6 font-semibold border-b-4 border-indigo-400
  classNames =
    props.href && router.pathname.startsWith(props.href)
      ? classNames + ' cursor-default  border-b-4 rounded border-indigo-500 text-indigo-500'
      : classNames +
        ' text-indigo-800  cursor-pointer  hover:text-indigo-500 hover:scale-110 hover:border-indigo-500 duration-300 '

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
