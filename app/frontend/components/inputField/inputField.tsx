import React from 'react'

interface InputProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent) => void
  variant: 'primary'
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
}

export const InputField = React.forwardRef(
  (
    { placeholder, variant, disabled, onChange, onBlur, value, name, readOnly }: InputProps,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary: 'font-small px-2 py-1 border-b2 border border-gray-600 disabled:bg-gray-100 disabled:opacity-50 read-only:bg-gray-100 read-only:opacity-50',
    }[variant]

    return (
      <input
        className={`rounded-md text-black ${variantClassName}`}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
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
