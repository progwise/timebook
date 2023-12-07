export interface ButtonProps {
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
  disabled,
  type = 'button',
  tooltip,
  form,
  onClick,
  ariaLabel,
}: ButtonProps): JSX.Element => {
  return (
    <button
      aria-label={ariaLabel}
      className="btn btn-square btn-primary btn-sm"
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
