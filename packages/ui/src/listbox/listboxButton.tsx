import { Listbox as HuListbox } from '@headlessui/react'
import { ReactNode, forwardRef } from 'react'
import { FaAngleDown } from 'react-icons/fa6'

interface ListboxButtonProps {
  children: ReactNode
}

export const ListboxButton = forwardRef<HTMLButtonElement, ListboxButtonProps>(({ children }, reference) => (
  <HuListbox.Button ref={reference} className="input flex w-full items-center justify-between bg-base-200 p-3">
    <span className="truncate">{children}</span>
    <FaAngleDown className="flex-none text-lg" />
  </HuListbox.Button>
))

ListboxButton.displayName = 'ListboxButton'
