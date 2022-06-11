import Link from 'next/link'

interface DayWeekSwitchProps {
  selectedButton: 'day' | 'week'
}

export const DayWeekSwitch = ({ selectedButton }: DayWeekSwitchProps) => {
  const selectedLink = 'hover:cursor-default bg-blue-400 border-1 border border-blue-700  '
  const unselectedLink = 'bg-gray-300 text-black border border-gray-500 '

  return (
    <>
      <span className="">
        <Link href={'/time/week'}>
          <a
            className={` gap-1 rounded-l-lg py-1  pr-2 pl-2 text-xs ${
              selectedButton === 'day' ? selectedLink : unselectedLink
            }`}
          >
            Week
          </a>
        </Link>
        <Link href={'/time'}>
          <a
            className={` gap-1 rounded-r-lg py-1 pl-3 pr-3 text-xs ${
              selectedButton === 'week' ? selectedLink : unselectedLink
            }`}
          >
            Day
          </a>
        </Link>
      </span>
    </>
  )
}
