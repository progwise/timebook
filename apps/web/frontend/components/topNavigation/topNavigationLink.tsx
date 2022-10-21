import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface TopNavigationLinkProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
}

export const TopNavigationLink: React.FC<TopNavigationLinkProps> = ({
  href,
  children,
  onClick,
  className,
}): JSX.Element => {
  const router = useRouter()

  if (href) {
    return (
      <Link href={href} passHref>
        {href && router.asPath.startsWith(href) ? (
          <span className={`text-blue-500 underline  ${className}`}>{children}</span>
        ) : (
          <span className={`cursor-pointer text-gray-500 hover:text-blue-500  dark:text-white ${className}`}>
            {children}
          </span>
        )}
      </Link>
    )
  }

  return (
    <span className={`cursor-pointer text-gray-500 hover:text-blue-500 ${className}`} onClick={onClick}>
      {children}
    </span>
  )
}
