import React from 'react'

interface InputProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent) => void
  variant: 'primary'
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readonly?: boolean
  className?: string
}

export const InputField = React.forwardRef(
  (
    { placeholder, variant, disabled, onChange, onBlur, value, name, readonly, className }: InputProps,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary: 'font-small px-2 py-1 border-gray-200 disabled:bg-gray-300 disabled:border-black',
    }[variant]

    return (
      <input
        className={`rounded-md text-black disabled:opacity-50 ${variantClassName} ${className}`}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        ref={ref}
        name={name}
      />
    )
  },
)

InputField.displayName = 'InputField'
