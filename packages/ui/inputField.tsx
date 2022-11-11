import React, { KeyboardEventHandler } from 'react'

interface InputProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent) => void
  variant: 'primary'
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  size?: number
  className?: string
  label?: string
  errorMessage?: string
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>
}

export const InputField = React.forwardRef(
  (
    {
      placeholder,
      variant,
      disabled,
      onChange,
      onKeyPress,
      onBlur,
      value,
      name,
      readOnly,
      size,
      className,
      label,
      errorMessage,
    }: InputProps,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary:
        'font-small px-2 py-1 border-b2 border border-gray-600 disabled:bg-gray-100 disabled:opacity-50 read-only:bg-gray-100 read-only:opacity-50',
    }[variant]

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="font-semibold text-gray-500 text-sm">
            {label}
          </label>
        )}
        <input
          aria-label={label}
          className={`rounded-md text-black ${variantClassName} ${className}`}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          ref={ref}
          onKeyPress={onKeyPress}
          name={name}
          size={size}
        />
        {errorMessage && <span className="text-xs text-red-500">{errorMessage}</span>}
      </div>
    )
  },
)

InputField.displayName = 'InputField'
