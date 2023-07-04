import React, { KeyboardEventHandler, ReactNode } from 'react'

export interface InputFieldProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  variant: 'primary'
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  size?: number
  className?: string
  inputClassName?: string
  label?: string
  errorMessage?: string | ReactNode
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  type?: 'number' | 'text' | 'email'
  form?: string
  hideLabel?: boolean
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  isDirty?: boolean
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
      onKeyDown,
      value,
      name,
      readOnly,
      size,
      className = '',
      inputClassName = '',
      label,
      errorMessage,
      type,
      form,
      hideLabel = false,
      onFocus,
      isDirty = false,
    }: InputFieldProps,
    reference: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const variantClassName: string = {
      primary: 'border border-gray-600 px-2 py-1',
    }[variant]

    return (
      <div className={`flex w-full flex-col gap-1 ${className}`}>
        {label && !hideLabel && (
          <label htmlFor={name} className="text-sm font-semibold">
            {label}
          </label>
        )}
        <span className="relative">
          <input
            aria-label={label}
            className={`w-full rounded-md read-only:opacity-70 read-only:dark:text-gray-600 ${
              isDirty ? 'bg-yellow-50' : ''
            } text-black dark:border-white dark:bg-slate-800 dark:text-white ${variantClassName} ${inputClassName}`}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={reference}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            name={name}
            size={size}
            form={form}
            onFocus={onFocus}
          />
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
