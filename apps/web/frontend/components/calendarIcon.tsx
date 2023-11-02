interface CalendarIconProps {
  label: string
  onClick: () => void
  children: JSX.Element
}

const CalendarIcon = ({ label, onClick, children }: CalendarIconProps): JSX.Element => {
  return (
    <button type="button" onClick={onClick} className="btn btn-sm border-none bg-base-300">
      <span className="sr-only">{label}</span>
      {children}
    </button>
  )
}

export default CalendarIcon
