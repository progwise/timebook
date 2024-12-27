import Image from 'next/image'

interface UserLabelProps {
  name?: string
  members?: { id: string; name?: string; image?: string }[]
  image?: string
  imageSize?: number
  duration?: number
  showDuration?: boolean
  maxNumberOfAvatars?: number
}

const DEFAULT_MAX_NUMBER_OF_AVATARS = 3
const DEFAULT_IMAGE_SIZE = 24

export const UserLabel = ({
  name,
  members,
  image,
  imageSize = DEFAULT_IMAGE_SIZE,
  duration,
  showDuration = true,
  maxNumberOfAvatars = DEFAULT_MAX_NUMBER_OF_AVATARS,
}: UserLabelProps) => {
  const hours = Math.floor((duration ?? 0) / 60).toString()
  const minutes = ((duration ?? 0) % 60).toString().padStart(2, '0')
  const numberOfMembersToBeDisplayed =
    maxNumberOfAvatars === members?.length ? maxNumberOfAvatars : maxNumberOfAvatars - 1
  const styleImage = { width: imageSize, height: imageSize }

  return (
    <div className="flex items-center gap-1">
      {members ? (
        <>
          <div className="avatar-group -ml-1 -space-x-3">
            {members.slice(0, numberOfMembersToBeDisplayed).map((member) =>
              member.image ? (
                <div key={member.id} className="avatar border-transparent">
                  <div style={styleImage}>
                    <Image width={imageSize} height={imageSize} src={member.image} alt={member.name ?? 'User avatar'} />
                  </div>
                </div>
              ) : (
                <div key={member.id} className="avatar placeholder border-transparent">
                  <div className="rounded-full bg-neutral text-neutral-content" style={styleImage}>
                    <span className="text-xl">{member.name?.charAt(0)}</span>
                  </div>
                </div>
              ),
            )}
            {members.length > numberOfMembersToBeDisplayed && (
              <div className="avatar placeholder border-transparent">
                <div className="rounded-full bg-neutral text-neutral-content" style={styleImage}>
                  <span>+{members.length - numberOfMembersToBeDisplayed}</span>
                </div>
              </div>
            )}
          </div>
          <span>
            {name} {showDuration && `(${hours}:${minutes})`}
          </span>
        </>
      ) : (
        <div className="flex items-center gap-1">
          {image ? (
            <Image
              src={image}
              alt={name ?? 'User avatar'}
              width={imageSize}
              height={imageSize}
              className="rounded-full"
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full bg-neutral text-neutral-content"
              style={styleImage}
            >
              <span className="text-xl">{name?.charAt(0)}</span>
            </div>
          )}
          <span>
            {name}
            {showDuration && duration !== undefined && ` (${hours}:${minutes})`}
          </span>
        </div>
      )}
    </div>
  )
}
