import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface TopNavigationMenuLinkProps {
  href: string
  children: ReactNode
  onClick?: () => void
}

export const TopNavigationMenuLink: React.FC<TopNavigationMenuLinkProps> = ({
  href,
  children,
  onClick,
}): JSX.Element => {
  const router = useRouter()

  return (
    <Link href={href} className={router.asPath.startsWith(href) ? 'active' : ''} onClick={onClick}>
      {children}
    </Link>
  )
}
