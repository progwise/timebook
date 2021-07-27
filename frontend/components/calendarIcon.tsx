export type CalendarIconChildPosition = 'left' | 'right'

export interface ICalendarIconProps {
    onClick?: () => void
    src: string
    className?: string
    children?: JSX.Element
    childPosition?: CalendarIconChildPosition
}

const CalendarIcon = (props: ICalendarIconProps): JSX.Element => {
    const handleClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }

    const childPosition: CalendarIconChildPosition = props.childPosition || 'right'

    let classNames = props.className

    if (props.onClick) {
        classNames = classNames + ' opacity-60 hover:opacity-100 cursor-pointer'
    }

    return (
        <div className="flex items-center">
            {props.children && childPosition === 'left' && props.children}
            <img onClick={handleClick} className={classNames} src={props.src} />
            {props.children && childPosition === 'right' && props.children}
        </div>
    )
}

export default CalendarIcon
