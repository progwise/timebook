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
        className="w-6 -rotate-90 fill-base-100 stroke-primary stroke-[1.5px]"
        style={
          {
            '--start-seconds': currentTime.getSeconds(),
            '--start-minutes': currentTime.getMinutes(),
            '--start-hours': currentTime.getHours() % 12,
            strokeLinecap: `round`,
          } as React.CSSProperties
        }
      >
        <circle cx="20" cy="20" r="18" />
        <g className="translate-x-5 translate-y-5 stroke-[0.5px]">
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[30deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[60deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-90" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[120deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[150deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-180" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[210deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[240deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[270deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[300deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[330deg]" />
          <line x1="15" y1="0" x2="16" y2="0" className="rotate-[360deg]" />
        </g>
        <line
          x2="9"
          className="stroke-[4px]"
          style={{
            transform:
              'transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-hours) * 30deg))',
            animation: 'rotateHourHand calc(12 * 60 * 60s) linear infinite',
            animationDelay: 'calc(calc(var(--start-minutes) * -60 * 1s) + calc(var(--start-seconds) * -1 * 1s))',
          }}
        />
        <line
          x2="13"
          className="stroke-2"
          style={{
            transform:
              'transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-minutes) * 6deg))',
            animation: 'rotateMinuteHand 3600s steps(60) infinite',
            animationDelay: 'calc(var(--start-seconds) * -1 * 1s)',
          }}
        />
        <line
          x2="16"
          className="stroke-primary stroke-[1.5px]"
          style={{
            transform:
              'transform(20px, 20px) rotate(0deg) translate(20px, 20px) rotate(calc(var(--start-seconds) * 6deg))',
            animation: 'rotateSecondsHand 60s steps(60) infinite',
          }}
        />
        <circle cx="20" cy="20" r="1.5" className="stroke-primary stroke-[1.5px]" />
      </svg>
    </>
  )
}
