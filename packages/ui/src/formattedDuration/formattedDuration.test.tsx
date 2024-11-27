// @ts-nocheck
import { render, screen } from '@testing-library/react'

import { FormattedDuration } from './formattedDuration'

describe('Formatted duration', () => {
  it('should give 0:00 for no duration', () => {
    render(<FormattedDuration minutes={undefined} title="test" />)
    const span = screen.getByTitle(/test/i)
    expect(span).toHaveTextContent('0:00')
  })

  it('should give 0:09 for 9 minutes', () => {
    render(<FormattedDuration minutes={9} title="test" />)
    const span = screen.getByTitle(/test/i)
    expect(span).toHaveTextContent('0:09')
  })
  it('should give 1:00 for 60 minutes', () => {
    render(<FormattedDuration minutes={60} title="test" />)
    const span = screen.getByTitle(/test/i)
    expect(span).toHaveTextContent('1:00')
  })
  it('should give 2:03 for 123 minutes', () => {
    render(<FormattedDuration minutes={123} title="test" />)
    const span = screen.getByTitle(/test/i)
    expect(span).toHaveTextContent('2:03')
  })
})
