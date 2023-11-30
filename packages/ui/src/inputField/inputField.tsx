import React, { KeyboardEventHandler, ReactNode } from 'react'

export interface InputFieldProps {
  name?: string
  value?: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  size?: number
  className?: string
  label?: string
  errorMessage?: string | ReactNode
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  loading?: boolean
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

      disabled,
      onChange,
      onKeyPress,
      onBlur,
      onKeyDown,
      value,
      name,
      readOnly,
      size,
      label,
      errorMessage,
      loading,
      type,
      form,
      onFocus,
      isDirty = false,
      className,
    }: InputFieldProps,
    reference: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label" htmlFor={name}>
            <span className="label-text">{label}</span>
          </label>
        )}
        <div className="relative">
          <input
            aria-label={label}
            className={`input input-bordered w-full ${isDirty ? 'input-warning' : ''} ${
              errorMessage ? 'input-error' : ''
            } ${loading ? 'pr-8' : ''} ${className}`}
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
          {loading && (
            <span className="absolute inset-y-0 right-2 flex">
              <span className="loading loading-spinner" />
            </span>
          )}
        </div>
        {errorMessage && (
          <label className="label">
            <span className="label-text-alt text-error" role="alert">
              {errorMessage}
            </span>
          </label>
        )}
      </div>
    )
  },
)

InputField.displayName = 'InputField'
