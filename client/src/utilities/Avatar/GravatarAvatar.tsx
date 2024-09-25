import { Avatar } from '@mantine/core'
import md5 from 'md5'
import { useState } from 'react'

const IMG_SIZE = 150

const getGravatarUrl = (email, imgSize) => {
  const hash = md5(email.trim().toLowerCase())

  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${imgSize}&d=404`
}

interface GravatarAvatarProps {
  imgSize?: number
  avatarSize?: string
  email: string
  firstName: string
  lastName: string
}

export const GravatarAvatar = ({
  imgSize = IMG_SIZE,
  avatarSize = 'lg',
  email,
  firstName,
  lastName,
}: GravatarAvatarProps): JSX.Element => {
  const [imageError, setImageError] = useState(false)

  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`

  return (
    <Avatar
      src={!imageError ? getGravatarUrl(email, imgSize) : undefined}
      size={avatarSize}
      onError={() => setImageError(true)}
      color='blue'
    >
      {imageError && initials}
    </Avatar>
  )
}
