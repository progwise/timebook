import { Listbox, ListboxProps } from './listbox'

type ListboxWithUnselectProps<TType> = Pick<ListboxProps<TType>, 'getKey' | 'getLabel' | 'options'> & {
  value: TType | undefined
  onChange: (newValue: TType | undefined) => void
  noOptionLabel: JSX.Element | string
}

const NO_OPTION_KEY = 'no-option'

export const ListboxWithUnselect = <TType = string,>(props: ListboxWithUnselectProps<TType>) => {
  type TTypeWithNoOption = TType | typeof NO_OPTION_KEY

  const handleChange = (newValue: TTypeWithNoOption) => {
    props.onChange(newValue === NO_OPTION_KEY ? undefined : newValue)
  }

  const getLabel = (value: TTypeWithNoOption) => {
    return value === NO_OPTION_KEY ? props.noOptionLabel : props.getLabel(value)
  }

  const getKey = (value: TTypeWithNoOption) => {
    return value === NO_OPTION_KEY ? NO_OPTION_KEY : props.getKey(value)
  }

  return (
    <Listbox<TTypeWithNoOption>
      value={props.value ?? NO_OPTION_KEY}
      onChange={handleChange}
      getLabel={getLabel}
      getKey={getKey}
      options={[NO_OPTION_KEY, ...props.options]}
    />
  )
}
