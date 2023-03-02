import React, { KeyboardEventHandler } from 'react'

import { Spinner } from '../spinner'

export interface InputFieldProps {
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
  loading?: boolean
  type?: 'number' | 'text'
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
      className = '',
      label,
      errorMessage,
      loading,
      type,
    }: InputFieldProps,
    // eslint-disable-next-line unicorn/prevent-abbreviations
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary:
        'font-small px-2 py-1 border-b2 border border-gray-600 disabled:bg-gray-100 disabled:opacity-50 read-only:bg-gray-100 read-only:opacity-50',
    }[variant]

    return (
      <div className={`flex w-full flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={name} className="text-sm font-semibold text-gray-500">
            {label}
          </label>
        )}
        <span className="relative">
          <input
            aria-label={label}
            className={`dark:placeholder-grey w-full rounded-md text-black dark:border-white dark:bg-slate-800 dark:text-white ${variantClassName} ${
              loading ? 'pr-8' : ''
            }`}
            type={type}
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

          {loading && (
            <div className="absolute inset-y-0 right-0 flex flex-col justify-center px-1">
              <Spinner />
            </div>
          )}
        </span>
        {errorMessage && (
          <span role="alert" className="text-xs text-red-500">
            {errorMessage}
          </span>
        )}
      </div>
    )
  },
)

InputField.displayName = 'InputField'
