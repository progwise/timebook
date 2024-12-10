import Link from 'next/link'
import { ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { FaCircleCheck, FaCircleXmark, FaTriangleExclamation } from 'react-icons/fa6'

export interface AlertLinkProps {
  children: ReactNode
  status: 'success' | 'error' | 'warning'
  closeHref: string
}

export const AlertLink: React.FC<AlertLinkProps> = ({ children, status, closeHref }): JSX.Element => {
  const className: string = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
  }[status]

  const AlertIcon: IconType = {
    success: FaCircleCheck,
    error: FaCircleXmark,
    warning: FaTriangleExclamation,
  }[status]

  return (
    <Link role="alert" href={closeHref} replace className={`alert mt-4 flex ${className}`}>
      <AlertIcon className="text-xl" />
      {children}
    </Link>
  )
}
