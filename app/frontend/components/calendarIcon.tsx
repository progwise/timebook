import Image from 'next/image'

export type CalendarIconChildPosition = 'left' | 'right'

export interface CalendarIconProps {
  title?: string
  onClick?: () => void
  src: string
  className?: string
  children?: JSX.Element
  childPosition?: CalendarIconChildPosition
  size?: number
}

const CalendarIcon = ({
  title = 'Calendar icon',
  onClick,
  src,
  className,
  children,
  childPosition = 'right',
  size = 24,
}: CalendarIconProps): JSX.Element => {
  let classNames = className

  if (onClick) {
    classNames = classNames + ' opacity-60 hover:opacity-100'
  }

  return (
    <div
      title={title}
      onClick={onClick}
      className={`flex items-center cursor-pointer ${childPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div>{children}</div>
      <Image className={classNames} src={src} width={size} height={size} />
    </div>
  )
}

export default CalendarIcon
