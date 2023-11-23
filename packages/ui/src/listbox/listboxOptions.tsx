import { Transition, Listbox as HuListbox } from '@headlessui/react'
import { forwardRef, ReactNode } from 'react'

interface ListboxOptionsProps {
  children: ReactNode
  style?: React.CSSProperties
}

export const ListboxOptions = forwardRef<HTMLUListElement, ListboxOptionsProps>(({ children, style }, reference) => (
  <Transition
    enter="transition"
    enterFrom="opacity-0 scale-y-75"
    enterTo="opacity-100 scale-y-100"
    leave="transition"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <HuListbox.Options style={style} ref={reference} className="w-full rounded-lg bg-base-200 py-2 shadow-lg">
      {children}
    </HuListbox.Options>
  </Transition>
))

ListboxOptions.displayName = 'ListboxOptions'
