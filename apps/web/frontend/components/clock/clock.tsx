const styleString = `@keyframes rotateSecondsHand {
  from {
    transform: translate(20px, 20px) rotate(calc(var(--start-seconds) * 6deg));
  }
  to {
    transform: translate(20px, 20px) rotate(calc(var(--start-seconds) * 6deg + 360deg));
  }
}

@keyframes rotateMinuteHand {
  from {
    transform: translate(20px, 20px) rotate(calc(var(--start-minutes) * 6deg));
  }
  to {
    transform: translate(20px, 20px) rotate(calc(var(--start-minutes) * 6deg + 360deg));
  }
}

@keyframes rotateHourHand {
  from {
    transform: translate(20px, 20px) rotate(calc(var(--start-hours) * 30deg));
  }
  to {
    transform: translate(20px, 20px) rotate(calc(var(--start-hours) * 30deg + 360deg));
  }
}
`

export const Clock = () => {
  const currentTime = new Date()

  return (
    <>
      <style>{styleString}</style>
      <svg
        viewBox="0 0 40 40"
        style={{
          width: `24px`,
          fill: `white`,
          stroke: `black`,
          strokeWidth: 2.5,
          strokeLinecap: `round`,
          transform: `rotate(-90deg)`,
        }}
      >
        <circle cx="20" cy="20" r="18" />
        <line
          x2="9"
          style={
            {
              '--start-hours': currentTime.getHours() % 12,
              transform: `transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-hours) * 30deg))`,
              strokeWidth: 4,
              animation: `rotateHourHand calc(12 * 60 * 60s) linear infinite`,
              animationDelay: `calc(calc(var(--start-minutes) * -60 * 1s) + calc(var(--start-seconds) * -1 * 1s))`,
            } as React.CSSProperties
          }
        />
        <line
          x2="13"
          style={
            {
              '--start-minutes': currentTime.getMinutes(),
              transform: `transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-minutes) * 6deg))`,
              strokeWidth: 2,
              animation: `rotateMinuteHand 3600s steps(60) infinite`,
              animationDelay: `calc(var(--start-seconds) * -1 * 1s)`,
            } as React.CSSProperties
          }
        />
        <line
          x2="16"
          style={
            {
              '--start-seconds': currentTime.getSeconds(),
              transform: `transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-seconds) * 6deg))`,
              strokeWidth: 1.5,
              stroke: `red`,
              animation: `rotateSecondsHand 60s steps(60) infinite`,
            } as React.CSSProperties
          }
        />
        <circle cx="20" cy="20" r="1.5" style={{ stroke: `red`, strokeWidth: 1.5 }} />
      </svg>
    </>
  )
}
