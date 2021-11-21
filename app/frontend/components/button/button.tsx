interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant: 'primary' | 'secondary' | 'primarySlim' | 'secondarySlim'
  onClick?: () => void
  children: React.ReactNode
  tooltip?: string
}

export const Button = ({
  children,
  disabled,
  type = 'button',
  tooltip,
  variant,
  onClick,
}: ButtonProps): JSX.Element => {
  const getVariantClassName = (): string => {
    switch (variant) {
      case 'primary': {
        return 'font-medium px-4 py-2 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500'
      }
      case 'secondary': {
        return 'font-medium px-4 py-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400'
      }
      case 'secondarySlim': {
        return 'font-small px-1.5 py-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400'
      }
      case 'primarySlim': {
        return 'font-small px-1.5 py-1 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500'
      }
      default:
        return ''
    }
  }

  return (
    <button
      className={`rounded-md text-white disabled:opacity-50 ${getVariantClassName()}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      title={tooltip}
    >
      {children}
    </button>
  )
}
