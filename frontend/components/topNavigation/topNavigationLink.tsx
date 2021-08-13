import Link from 'next/link'
import { useRouter } from 'next/router'

export interface ITopNavigationLinkProps {
    href: string
    title: string
}

export const TopNavigationLink = (props: ITopNavigationLinkProps): JSX.Element => {
    const router = useRouter()
    let classNames = 'mx-3 my-3 bg-transparent text-indigo-500 font-semibold py-1 px-4 border border-indigo-300 rounded'
    if (!router.pathname.startsWith(props.href)) {
        classNames = classNames + ' cursor-pointer hover:text-indigo-900 hover:border-indigo-900'
    } else {
        classNames = classNames + ' cursor-default text-indigo-900 border-indigo-900'
    }
    return (
        <Link href={props.href}>
            <span className={classNames}>{props.title}</span>
        </Link>
    )
}
