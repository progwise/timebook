import { Listbox as HuListbox } from '@headlessui/react'
import { ReactNode } from 'react'
import { BiCheck } from 'react-icons/bi'

interface ListboxOptionProps<TType> {
  value: TType
  children: ReactNode
}

export const ListboxOption = <TType,>({ value, children }: ListboxOptionProps<TType>) => {
  return (
    <HuListbox.Option
      value={value}
      className="flex cursor-pointer items-center gap-2 p-2 ui-active:rounded-box ui-active:bg-primary ui-active:text-primary-content"
    >
      <BiCheck className="flex-none text-xl opacity-0 ui-selected:opacity-100" />
      <span className="truncate">{children}</span>
    </HuListbox.Option>
  )
}
