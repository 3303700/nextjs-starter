import { cn, fontPoppins, type PropsWithClassName } from '@/lib/utils'

export default function RouterLoading({
  children = (
    <span className={cn('animate-bounce', fontPoppins.className)}>Loading</span>
  ),
  className,
}: React.PropsWithChildren & PropsWithClassName) {
  return (
    <div className={cn(`flex h-dvh items-center justify-center`, className)}>
      {children}
    </div>
  )
}
