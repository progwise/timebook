import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface TopNavigationMenuLinkProps {
  href: string
  children: ReactNode
  onClick?: () => void
}

export const TopNavigationMenuLink: React.FC<TopNavigationMenuLinkProps> = (props): JSX.Element => {
  const router = useRouter()

  return <Link className={router.asPath.startsWith(props.href) ? 'active' : ''} {...props} />
}
