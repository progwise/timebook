import { ReactNode } from 'react'

interface LabelProps {
  children: ReactNode
  color: 'blue' | 'yellow'
  invert?: boolean
}

export const Label = ({ children, color, invert = false }: LabelProps) => {
  const colorClasses = {
    blue: 'border-blue-700 bg-blue-100 text-blue-700 dark:border-blue-100 dark:bg-blue-700 dark:text-blue-100',
    yellow:
      'border-yellow-700 bg-yellow-100 text-yellow-700 dark:border-yellow-100 dark:bg-yellow-700 dark:text-yellow-100',
  }[invert ? (color === 'blue' ? 'yellow' : 'blue') : color]

  return <span className={`rounded-full border py-1 px-3 text-xs ${colorClasses}`}>{children}</span>
}
