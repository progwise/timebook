interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger'

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
    primary:
      ' px-5 hover:scale-95 duration-300 shadow-xl   font-medium bg-blue-400 text-white rounded-md hover:bg-blue-500',
    secondary:
      'shadow-xl hover:scale-95 duration-300 font-medium text-blue-400 border-2 border-blue-400 rounded-md hover:text-blue-500 hover:border-blue-500',
    tertiary: 'font-medium text-blue-400 border-b-2 border-blue-400 hover:text-blue-500 hover:border-blue-500 ',

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
