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
      className="ui-active:bg-blue-50 dark:ui-active:bg-slate-600 flex cursor-pointer items-center gap-2 p-2"
    >
      <BiCheck className="ui-selected:opacity-100 flex-none text-xl opacity-0" />
      <span className="truncate">{children}</span>
    </HuListbox.Option>
  )
}
