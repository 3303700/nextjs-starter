import { cn, type PropsWithClassName } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

export function UserAvatar({
  className = 'w-7 h-7',
  image,
  name,
}: PropsWithClassName<{
  image: string | undefined | null
  name: string | undefined | null
}>) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={image || undefined}
        alt={name || ''}
      />
      {!image ? (
        <AvatarFallback className='flex bg-amber-500 text-xs text-white'>
          <span className='truncate'>{name?.substring(0, 1)}</span>
        </AvatarFallback>
      ) : (
        <AvatarFallback className='bg-amber-500'></AvatarFallback>
      )}
    </Avatar>
  )
}

export function UserAvatarSkeleton({ className }: PropsWithClassName) {
  return (
    <Avatar className={cn('animate-pulse duration-1000', className)}>
      <AvatarFallback></AvatarFallback>
    </Avatar>
  )
}
