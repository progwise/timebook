import { Combobox as HUCombobox, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { HiCheck, HiSelector } from 'react-icons/hi'

interface ComboBoxProps<Option> {
  value?: Option
  disabled?: boolean
  onChange: (id: string | null) => void
  displayValue: (option?: Option) => string
  onBlur: () => void
  options: Option[]
  onCreateNew?: (title: string) => Promise<Option>
  isCreating?: boolean
}

interface NewOption {
  id: undefined
}

export const ComboBox = <Option extends { id: string }>({
  value,
  disabled,
  onChange,
  onBlur,
  displayValue,
  options,
  onCreateNew,
  isCreating,
}: ComboBoxProps<Option>): JSX.Element => {
  const [inputQuery, setInputQuery] = useState('')

  const filteredOptions = options.filter((option) => {
    return displayValue(option).toLowerCase().includes(inputQuery.toLowerCase())
  })

  const handleChange = async (selected?: Option | NewOption) => {
    if (selected && !selected.id && onCreateNew) {
      const createdOption = await onCreateNew(inputQuery)
      selected.id = createdOption.id
    }
    setInputQuery('')
    // eslint-disable-next-line unicorn/no-null
    onChange(selected?.id ?? null)
  }

  const optionTitleExists = options?.some((option) => displayValue(option) === inputQuery)

  const showCreateOption = !!onCreateNew && inputQuery.length > 0 && !optionTitleExists

  const allOptions: (Option | NewOption | undefined)[] = [undefined, ...filteredOptions]

  if (showCreateOption) {
    const newOption: NewOption = { id: undefined }
    allOptions.push(newOption)
  }

  return (
    <HUCombobox value={value} disabled={isCreating || disabled} onChange={handleChange}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <HUCombobox.Input<'input', Option | undefined>
            className="w-full py-2  pl-3 text-sm leading-5 focus:ring-0 dark:border-white dark:bg-slate-800 dark:text-white"
            displayValue={displayValue}
            onChange={(event) => setInputQuery(event.target.value)}
            onBlur={onBlur}
          />
          <HUCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </HUCombobox.Button>
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <HUCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {allOptions.map((option) => (
              <HUCombobox.Option<'li', Option | NewOption | undefined>
                key={option ? option.id ?? 'New Option' : 'No Option'}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {!option || option.id ? displayValue(option) : `Create "${inputQuery}"`}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : undefined}
                  </>
                )}
              </HUCombobox.Option>
            ))}
          </HUCombobox.Options>
        </Transition>
      </div>
    </HUCombobox>
  )
}
