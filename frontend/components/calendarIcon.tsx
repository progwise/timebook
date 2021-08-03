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
        classNames = classNames + ' opacity-60 hover:opacity-100'
    }

    return (
        <div title="Calendar icon" onClick={handleClick} className="flex items-center cursor-pointer">
            {props.children && childPosition === 'left' && props.children}
            <img className={classNames} src={props.src} />
            {props.children && childPosition === 'right' && props.children}
        </div>
    )
}

export default CalendarIcon
