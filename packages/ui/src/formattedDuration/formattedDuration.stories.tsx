import type { Meta } from '@storybook/react'

import { FormattedDuration, FormattedDurationProps } from './formattedDuration'

const config: Meta<FormattedDurationProps> = {
  title: 'FormattedDuration',
  component: FormattedDuration,
  args: {
    minutes: 83,
  },
}
export default config

export const Default: Meta<FormattedDurationProps> = {
  args: {},
}

export const Null: Meta<FormattedDurationProps> = {
  args: {
    minutes: 0,
  },
}

export const UnderOneHour: Meta<FormattedDurationProps> = {
  args: {
    minutes: 1,
  },
}
