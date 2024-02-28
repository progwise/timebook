import { Transition, Listbox as HuListbox } from '@headlessui/react'
import { forwardRef, ReactNode } from 'react'

interface ListboxOptionsProps {
  children: ReactNode
  style?: React.CSSProperties
}

export const ListboxOptions = forwardRef<HTMLDivElement, ListboxOptionsProps>(({ children, style }, reference) => (
  <div style={style} ref={reference}>
    <Transition
      enter="transition"
      enterFrom="opacity-0 "
      enterTo="opacity-100 scale-y-100"
      leave="transition"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <HuListbox.Options className="min-w-64 rounded-box bg-base-200 shadow-lg">{children}</HuListbox.Options>
    </Transition>
  </div>
))

ListboxOptions.displayName = 'ListboxOptions'
