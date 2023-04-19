/* eslint-disable unicorn/no-nested-ternary */
import { Switch } from '@headlessui/react'
import { BiLock, BiLockOpen } from 'react-icons/bi'

import { Spinner } from '@progwise/timebook-ui'

interface LockSwitchProps {
  locked: boolean
  onChange?: (locked: boolean) => void
  loading?: boolean
}

export const LockSwitch = ({ locked, onChange, loading = false }: LockSwitchProps) => {
  const title = locked ? 'Unlock' : 'Lock'

  return (
    <Switch
      checked={locked}
      onChange={onChange}
      className="ui-checked:bg-blue-400 flex w-14 items-center rounded-full border-2 border-transparent bg-blue-200 px-1 py-0.5 outline-none transition-colors ease-in-out focus-visible:ring-2 focus-visible:ring-blue-600"
      title={title}
    >
      <span className="sr-only">{title}</span>
      <span className="ui-checked:translate-x-5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg text-blue-400 transition-transform ease-in-out">
        {loading ? <Spinner /> : locked ? <BiLock /> : <BiLockOpen />}
      </span>
    </Switch>
  )
}
