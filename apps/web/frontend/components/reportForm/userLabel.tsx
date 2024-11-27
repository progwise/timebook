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
    <div className="flex items-center gap-2">
      {image ? (
        <Image src={image} alt={name ?? 'User avatar'} width={26} height={26} className="rounded-full" />
      ) : (
        <div className="flex size-6 items-center justify-center rounded-full bg-neutral text-neutral-content">
          <span className="text-xl">{name?.charAt(0)}</span>
        </div>
      )}
      <span>
        {name} ({hours}:{minutes})
      </span>
    </div>
  )
}
