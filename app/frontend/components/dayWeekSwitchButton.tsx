import Link from 'next/link'
import { useRouter } from 'next/router'

interface DayWeekSwitchProps {
  selectedButton: 'day' | 'week'
}

export const DayWeekSwitch = ({ selectedButton }: DayWeekSwitchProps) => {
  const selectedLink = 'cursor-default bg-blue-400 border-1 border border-blue-700  '
  const unselectedLink = 'bg-gray-300 text-black border border-gray-500 '

const router = useRouter()
const teamSlug = router.query.teamSlug

  return (
    <span className="text-center text-xs">
      <Link href={`/${teamSlug}/time/week`}>
        <a
          className={`inline-block w-10 rounded-l-lg py-1 ${selectedButton === 'week' ? selectedLink : unselectedLink}`}
        >
          Week
        </a>
      </Link>
      <Link href={`/${teamSlug}/time`}>
        <a
          className={` inline-block w-10 rounded-r-lg py-1 ${selectedButton === 'day' ? selectedLink : unselectedLink}`}
        >
          Day
        </a>
      </Link>
    </span>
  )
}
