import type { Meta } from '@storybook/react'

import { Button, ButtonProps } from './button'

const config: Meta<ButtonProps> = {
  title: 'Button',
  component: Button,
  args: {
    children: 'Label',
  },
}
export default config

export const Primary: Meta<ButtonProps> = {
  args: {
    variant: 'primary',
  },
}

export const Secondary: Meta<ButtonProps> = {
  args: {
    variant: 'secondary',
  },
}

export const Tertiary: Meta<ButtonProps> = {
  args: {
    variant: 'tertiary',
  },
}

export const Danger: Meta<ButtonProps> = {
  args: {
    variant: 'danger',
  },
}
