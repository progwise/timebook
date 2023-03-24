import { convertDurationStringToMinutes } from './convertDurationStringToMinutes'

it.each([
  { input: '', expectedMinutes: 0 },
  { input: '1', expectedMinutes: 60 },
  { input: '1:30', expectedMinutes: 90 },
  { input: ':30', expectedMinutes: 30 },
  { input: '.5', expectedMinutes: 30 },
  { input: ',5', expectedMinutes: 30 },
  { input: '1,5', expectedMinutes: 90 },
  { input: '1.5', expectedMinutes: 90 },
  { input: '0:3', expectedMinutes: 30 },
  { input: '1,09', expectedMinutes: 65 },
  { input: '0:009', expectedMinutes: 0 },
])('should parse "$input" to $expectedMinutes', ({ input, expectedMinutes }) => {
  const result = convertDurationStringToMinutes(input)
  expect(result).toBe(expectedMinutes)
})
