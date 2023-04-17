interface UserLabelProps {
  name: string
  duration: number
}

export const UserLabel = ({ name, duration }: UserLabelProps) => {
  const hours = Math.floor(duration / 60).toString()
  const minutes = (duration % 60).toString().padStart(2, '0')

  return (
    <>
      {name} ({hours}:{minutes})
    </>
  )
}
