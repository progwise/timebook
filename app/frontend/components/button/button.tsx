interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant:
    | 'primary_blue'
    | 'primary_gray'
    | 'secondary_blue'
    | 'secondary_gray'
    | 'tertiary_blue'
    | 'tertiary_gray'
    | 'tertiary_blue_underlined'
    | 'tertiary_gray_underlined'
    | 'danger'
    | 'tertiary_white'

  onClick?: () => void
  children: React.ReactNode
  className?: string
  tooltip?: string
  form?: string
  ariaLabel?: string
}

export const Button = ({
  children,
  className,
  disabled,
  type = 'button',
  tooltip,
  variant,
  form,
  onClick,
  ariaLabel,
}: ButtonProps): JSX.Element => {
  const variantClassName: string = {
    primary_blue:
      ' px-5 hover:scale-95 duration-300 shadow-xl   font-medium bg-blue-400 text-white rounded-md hover:bg-blue-500',
    primary_gray:
      'px-5 hover:scale-95 duration-300 shadow-xl font-medium bg-gray-400 text-white rounded-md hover:bg-gray-500',
    secondary_blue:
      'shadow-xl font-medium text-blue-400 border-2 border-blue-400 rounded-md hover:text-blue-500 hover:border-blue-500',
    secondary_gray:
      'shadow-xl font-medium text-gray-400 border-2 border-gray-400 rounded-md hover:text-gray-500 hover:border-gray-500',
    tertiary_blue: 'font-small text-blue-400 hover:text-blue-500',
    tertiary_gray: 'font-medium text-gray-500 hover:text-gray-600',
    tertiary_white: 'font-small text-white hover:text-gray-200',
    tertiary_blue_underlined:
      'font-medium    border-b-2 border-blue-400 text-blue-400 hover:border-blue-500 hover:text-blue-500',
    tertiary_gray_underlined:
      'font-medium text-gray-500 border-b-2 border-gray-400 hover:text-gray-600 hover:border-gray-500',
    danger: 'shadow-xl font medium bg-red-400 text-white hover:bg-red-600 rounded-md',
  }[variant]

  return (
    <button
      aria-label={ariaLabel}
      className={` flex items-center justify-center gap-1  p-2  disabled:opacity-50 ${variantClassName} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      title={tooltip}
      form={form}
    >
      {children}
    </button>
  )
}
