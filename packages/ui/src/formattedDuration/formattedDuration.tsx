export interface FormattedDurationProps {
  minutes: number | undefined
  title: string
}

export const FormattedDuration: React.FC<FormattedDurationProps> = ({ minutes, title }) => {
  const valueAsString = !minutes ? '0:00' : `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`
  return (
    <span title={title} className="font-mono">
      {valueAsString}
    </span>
  )
}
