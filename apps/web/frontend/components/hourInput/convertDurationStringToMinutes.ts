const parseRegex = /^(?<hours>\d*)(?<separator>[,.:]?)(?<minutes>\d*)$/

export const convertDurationStringToMinutes = (durationString: string) => {
  if (durationString === '') {
    return 0
  }

  const parsedDuration = durationString.match(parseRegex)

  if (!parsedDuration?.groups) {
    return
  }

  const { separator, hours: hoursString, minutes: minutesString } = parsedDuration.groups

  if (separator === ':') {
    const hours = Number.parseInt(hoursString || '0')
    const minutes = Number.parseInt((minutesString || '0').slice(0, 2).padEnd(2, '0'))
    return hours * 60 + minutes
  }

  const durationInHours = Number.parseFloat(`${hoursString}.${minutesString}`)
  return Math.floor(durationInHours * 60)
}
