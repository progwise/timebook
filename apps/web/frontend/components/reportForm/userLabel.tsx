import Image from 'next/image'

interface UserLabelProps {
  name: string
  duration: number
  image?: string
}

export const UserLabel = ({ name, duration, image }: UserLabelProps) => {
  const hours = Math.floor(duration / 60).toString()
  const minutes = (duration % 60).toString().padStart(2, '0')

  return (
    <div>
      {image && <Image src={image} alt="User avatar" width={26} height={26} className="size-6 rounded-full" />}
      <span>
        {name} ({hours}:{minutes})
      </span>
    </div>
  )
}
