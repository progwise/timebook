export const Clock = () => {
  const svgClock = document.querySelector('svg.clock')
  const currentTime = new Date()

  svgClock?.style.setProperty('--start-seconds', currentTime.getSeconds())
  svgClock?.style.setProperty('--start-minutes', currentTime.getMinutes())
  svgClock?.style.setProperty('--start-hours', currentTime.getHours() % 12)

  return (
    <svg className="clock" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" />
      <g className="marks">
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
        <line x1="15" y1="0" x2="16" y2="0" />
      </g>
      <text x="0" y="0" className="timebookText">
        #timebook
      </text>
      <line x1="0" y1="0" x2="9" y2="0" className="hour " />
      <line x1="0" y1="0" x2="13" y2="0" className="minute" />
      <line x1="0" y1="0" x2="16" y2="0" className="secondss" />
      <circle cx="20" cy="20" r="0.7" className="pin" />
    </svg>
  )
}
