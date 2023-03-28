import { Listbox as HuListbox } from '@headlessui/react'
import { ReactNode, forwardRef } from 'react'
import { BiExpandVertical } from 'react-icons/bi'

interface ListboxButtonProps {
  children: ReactNode
}

export const ListboxButton = forwardRef<HTMLButtonElement, ListboxButtonProps>(({ children }, reference) => (
  <HuListbox.Button
    ref={reference}
    className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:bg-slate-700"
  >
    <span className="truncate">{children}</span>
    <BiExpandVertical className="flex-none text-lg" />
  </HuListbox.Button>
))

ListboxButton.displayName = 'ListboxButton'
