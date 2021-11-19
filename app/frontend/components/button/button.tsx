interface ButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit'
  variant: 'primary' | 'secondary'
  onClick?: () => void
  children: React.ReactNode
}

export const Button = ({ children, disabled, type = 'button', variant, onClick }: ButtonProps): JSX.Element => {
  const classNamePrimary = 'bg-blue-500 hover:bg-blue-700 disabled:bg-blue-500'
  const classNameSecondary = 'bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400'
  return (
    <button
      className={`font-medium rounded-lg text-white px-4 py-2 disabled:opacity-50 ${
        variant === 'primary' ? classNamePrimary : classNameSecondary
      }`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
