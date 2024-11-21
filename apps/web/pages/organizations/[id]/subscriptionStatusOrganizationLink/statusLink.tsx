import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface StatusLinkProps {
  children: ReactNode
  className?: string
}

export const StatusLink: React.FC<StatusLinkProps> = ({ children, className }): JSX.Element => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Link role="alert" href={`/organizations/${id}`} replace className={`alert mt-4 flex ${className}`}>
      {children}
    </Link>
  )
}
