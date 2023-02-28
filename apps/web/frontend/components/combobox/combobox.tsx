import { Combobox as HUCombobox, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { HiCheck, HiSelector } from 'react-icons/hi'

interface ComboBoxProps<TOption> {
  value?: TOption
  disabled?: boolean
  onChange: (id: string | null) => void
  displayValue: (option: TOption) => string
  onBlur?: () => void
  options: TOption[]
  noOptionLabel: string
  onCreateNew?: (title: string) => Promise<TOption>
  isCreating?: boolean
}

type NewOption = 'newOption'

type NoOption = 'noOption'

export const ComboBox = <TOption extends { id: string }>({
  value,
  disabled,
  onChange,
  onBlur,
  displayValue,
  options,
  noOptionLabel,
  onCreateNew,
  isCreating,
}: ComboBoxProps<TOption>): JSX.Element => {
  const [inputQuery, setInputQuery] = useState('')

  const generateLabel = (option: TOption | NewOption | NoOption) => {
    if (option === 'newOption') {
      return `Create "${inputQuery}"`
    }
    if (option === 'noOption') {
      return noOptionLabel
    }
    return displayValue(option)
  }

  const filteredOptions = options.filter((option) => {
    return displayValue(option).toLowerCase().includes(inputQuery.toLowerCase())
  })

  const handleChange = async (selected: TOption | NewOption | NoOption) => {
    if (selected === 'newOption') {
      if (onCreateNew) {
        const createdOption = await onCreateNew(inputQuery)
        onChange(createdOption.id)
      }
    } else if (selected === 'noOption') {
      // eslint-disable-next-line unicorn/no-null
      onChange(null)
    } else {
      onChange(selected.id)
    }
    setInputQuery('')
  }

  const optionTitleExists = options?.some((option) => displayValue(option) === inputQuery)

  const showCreateOption = !!onCreateNew && inputQuery.length > 0 && !optionTitleExists

  const allOptions: (TOption | NewOption | NoOption)[] = ['noOption', ...filteredOptions]

  if (showCreateOption) {
    allOptions.push('newOption')
  }

  return (
    <HUCombobox<TOption | NewOption | NoOption>
      value={value ?? 'noOption'}
      disabled={isCreating || disabled}
      onChange={handleChange}
    >
      <div className="mt-1">
        <div className="flex w-full cursor-default justify-between overflow-hidden rounded border bg-transparent text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 dark:border-white sm:text-sm">
          <HUCombobox.Input<'input', TOption | NoOption | NewOption>
            className="w-full border-0 text-sm leading-5 focus:ring-0 dark:bg-slate-800 dark:text-white "
            displayValue={generateLabel}
            onChange={(event) => setInputQuery(event.target.value)}
            onBlur={onBlur}
          />
          <HUCombobox.Button className="inset-y-0 right-0 flex items-center pr-2">
            <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </HUCombobox.Button>
        </div>
        <div className="relative">
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <HUCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none  dark:bg-slate-800 sm:text-sm">
              {allOptions.map((option) => (
                <HUCombobox.Option<'li', TOption | NewOption | NoOption>
                  key={typeof option === 'string' ? option : option.id}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900  dark:text-white'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {generateLabel(option)}
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
      </div>
    </HUCombobox>
  )
}
