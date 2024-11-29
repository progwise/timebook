import Image from 'next/image'

interface UserLabelProps {
  name: string
  duration: number
  image?: string
  members?: { id: string; image?: string; name?: string }[]
  isAllUsers?: boolean
}

const MAX_NUMBER_OF_AVATARS = 3

export const UserLabel = ({ name, duration, image, members, isAllUsers }: UserLabelProps) => {
  const hours = Math.floor(duration / 60).toString()
  const minutes = (duration % 60).toString().padStart(2, '0')
  const numberOfMembersToBeDisplayed =
    MAX_NUMBER_OF_AVATARS === members?.length ? MAX_NUMBER_OF_AVATARS : MAX_NUMBER_OF_AVATARS - 1

  return (
    <div className="flex items-center gap-1">
      {isAllUsers && members ? (
        <>
          <div className="avatar-group -space-x-3 rtl:space-x-reverse">
            {members.slice(0, numberOfMembersToBeDisplayed).map((member) =>
              member.image ? (
                <div key={member.id} className="avatar">
                  <div className="size-6">
                    <Image width={26} height={26} src={member.image} alt={member.name ?? 'User avatar'} />
                  </div>
                </div>
              ) : (
                <div key={member.id} className="avatar placeholder">
                  <div className="size-6 rounded-full bg-neutral text-neutral-content">
                    <span className="text-xl">{member.name?.charAt(0)}</span>
                  </div>
                </div>
              ),
            )}
            {members.length > numberOfMembersToBeDisplayed && (
              <div className="avatar placeholder">
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
      )}
    </div>
  )
}
