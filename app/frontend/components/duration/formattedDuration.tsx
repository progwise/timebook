interface FormattedDurationProps {
  minutes: number | undefined
}

export const FormattedDuration: React.FC<FormattedDurationProps> = ({ minutes }) => {
  const valueAsString = !minutes ? '0:00' : `${Math.floor(minutes / 60)}:${('0' + (minutes % 60)).slice(-2)}`
  return <p className="font-mono">{valueAsString}</p>
}
