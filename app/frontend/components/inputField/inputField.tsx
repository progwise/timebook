import React from 'react'

interface InputProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent) => void
  variant: 'primary'
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputField = React.forwardRef(
  (
    { placeholder, variant, disabled, onChange, onBlur, value, name }: InputProps,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary:
        'font-small px-2 py-1 border-gray-200 hover:border-black focus:border-black disabled:bg-gray-300 disabled:border-black',
    }[variant]

    return (
      <input
        className={`rounded-md text-black disabled:opacity-50 ${variantClassName}`}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        ref={ref}
        name={name}
      />
    )
  },
)
