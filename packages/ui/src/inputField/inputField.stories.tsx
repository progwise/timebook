import type { Meta } from '@storybook/react'

import { InputField, InputFieldProps } from './inputField'

const config: Meta<InputFieldProps> = {
  title: 'InputField',
  component: InputField,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
}
export default config

export const Default: Meta<InputFieldProps> = {
  args: {},
}

export const WithErrorMessage: Meta<InputFieldProps> = {
  args: {
    errorMessage: 'some error',
  },
}
