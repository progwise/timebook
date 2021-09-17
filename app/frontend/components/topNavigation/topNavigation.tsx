import { TopNavigationLink } from './topNavigationLink'

export const TopNavigation = (): JSX.Element => {
    return (
        <nav className="md:container md:mx-auto flex justify-center">
            <TopNavigationLink href="/home" title="Home" />
            <TopNavigationLink href="/time" title="Time" />
            <TopNavigationLink href="/projects" title="Projects" />
            <TopNavigationLink href="/reports" title="Reports" />
        </nav>
    )
}
