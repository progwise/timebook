interface CalendarIconProps {
  label: string
  onClick: () => void
  children: JSX.Element
}

const CalendarIcon = ({ label, onClick, children }: CalendarIconProps): JSX.Element => {
  return (
    <button type="button" onClick={onClick} className="opacity-60 hover:opacity-100">
      <span className="sr-only">{label}</span>
      {children}
    </button>
  )
}

export default CalendarIcon
