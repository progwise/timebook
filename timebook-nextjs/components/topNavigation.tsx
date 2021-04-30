import Link from 'next/link'

export const TopNavigation = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/timetable">Timetable</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/reports">Reports</Link></li>
      </ul>
    </nav>
  )
}