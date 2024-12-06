import Image from 'next/image'

interface UserLabelProps {
  name: string
  duration?: number
  image?: string
  members?: { id: string; image?: string; name?: string }[]
}

const MAX_NUMBER_OF_AVATARS = 3

export const UserLabel = ({ name, duration, image, members }: UserLabelProps) => {
  const hours = Math.floor((duration ?? 0) / 60).toString()
  const minutes = ((duration ?? 0) % 60).toString().padStart(2, '0')
  const numberOfMembersToBeDisplayed =
    MAX_NUMBER_OF_AVATARS === members?.length ? MAX_NUMBER_OF_AVATARS : MAX_NUMBER_OF_AVATARS - 1

  return (
    <div className="flex items-center gap-1">
      {members ? (
        <>
          <div className="avatar-group -ml-1 -space-x-3">
            {members.slice(0, numberOfMembersToBeDisplayed).map((member) =>
              member.image ? (
                <div key={member.id} className="avatar border-transparent">
                  <div className="size-6">
                    <Image width={24} height={24} src={member.image} alt={member.name ?? 'User avatar'} />
                  </div>
                </div>
              ) : (
                <div key={member.id} className="avatar placeholder border-transparent">
                  <div className="size-6 rounded-full bg-neutral text-neutral-content">
                    <span className="text-xl">{member.name?.charAt(0)}</span>
                  </div>
                </div>
              ),
            )}
            {members.length > numberOfMembersToBeDisplayed && (
              <div className="avatar placeholder border-transparent">
                <div className="size-6 rounded-full bg-neutral text-neutral-content">
                  <span>+{members.length - numberOfMembersToBeDisplayed}</span>
                </div>
              </div>
            )}
          </div>
          <span>
            {name} ({hours}:{minutes})
          </span>
        </>
      ) : (
        <div className="flex items-center gap-1">
          {image ? (
            <Image src={image} alt={name ?? 'User avatar'} width={24} height={24} className="rounded-full" />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-neutral text-neutral-content">
              <span className="text-xl">{name?.charAt(0)}</span>
            </div>
          )}
          <span>
            {name}
            {duration !== undefined && ` (${hours}:${minutes})`}
          </span>
        </div>
      )}
    </div>
  )
}
