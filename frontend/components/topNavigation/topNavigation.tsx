import Link from 'next/link'
import { TopNavigationLink } from './topNavigationLink'

export const TopNavigation = () => {
    return (
        <nav className="md:container md:mx-auto flex justify-center">
            <TopNavigationLink href="/home" title="Home"></TopNavigationLink>
            <TopNavigationLink href="/time" title="Time"></TopNavigationLink>
            <TopNavigationLink href="/projects" title="Projects"></TopNavigationLink>
            <TopNavigationLink href="/reports" title="Reports"></TopNavigationLink>
        </nav>
    )
}
