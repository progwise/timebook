import { Switch } from '@headlessui/react'

interface ToggleProps {
  onChange: (value: boolean) => void
  checked: boolean
  disabled?: boolean
}

export const Toggle = ({ onChange, disabled = false, checked }: ToggleProps): JSX.Element => {
  return (
    <Switch
      checked={checked ?? false}
      onChange={() => onChange(!checked)}
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full disabled:opacity-50`}
      disabled={disabled}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 rounded-full bg-white	 transition-transform`}
      />
    </Switch>
  )
}
