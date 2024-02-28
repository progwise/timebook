/* eslint-disable unicorn/no-useless-undefined */
import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react-dom'
import { Listbox as HuListbox } from '@headlessui/react'

import { ListboxButton } from './listboxButton'
import { ListboxOption } from './listboxOption'
import { ListboxOptions } from './listboxOptions'

export interface ListboxProps<TType> {
  value: TType
  onChange: (newValue: TType) => void
  getLabel: (value: TType) => JSX.Element | string
  getKey: (value: TType) => React.Key
  options: ReadonlyArray<TType>
}

export const Listbox = <TType = string,>({ getLabel, options, getKey, value, onChange }: ListboxProps<TType>) => {
  const { floatingStyles, refs } = useFloating({
    middleware: [flip(), offset(4)],
    whileElementsMounted: autoUpdate,
  })
  return (
    <HuListbox value={value} onChange={onChange}>
      <div className="z-10 w-64 py-2">
        <ListboxButton ref={refs.setReference}>{getLabel(value)}</ListboxButton>
        <ListboxOptions ref={refs.setFloating} style={floatingStyles}>
          {options.map((option) => (
            <ListboxOption key={getKey(option)} value={option}>
              {getLabel(option)}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </HuListbox>
  )
}
