interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant: 'primary' | 'secondary' | 'danger' | 'primarySlim' | 'secondarySlim' | 'dangerSlim'
  onClick?: () => void
  children: React.ReactNode
  className?: string
  tooltip?: string
  form?: string
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
}: ButtonProps): JSX.Element => {
  const variantClassName: string = {
    primary: 'font-medium bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500',
    secondary: 'font-medium bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400',
    danger: 'font-medium bg-red-700 hover:bg-red-800 disabled:bg-red-700',
    primarySlim: 'font-small bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500',
    secondarySlim: 'font-small bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400',
    dangerSlim: 'font-small bg-red-700 hover:bg-red-800 disabled:bg-red-700',
  }[variant]

  return (
    <button
      className={`flex items-center justify-center gap-1 rounded-md p-2 text-white disabled:opacity-50 ${variantClassName} ${className}`}
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
