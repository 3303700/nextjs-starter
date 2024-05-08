import { cn, type PropsWithClassName } from '@/lib/utils'

export default function FormRootErrorMessage({
  className,
  message,
}: PropsWithClassName<{
  message: string | undefined | null
}>) {
  if (!message) {
    return null
  }

  return (
    <div
      className={cn(
        'text-balance py-2 text-center text-destructive',
        className,
      )}
    >
      <span>{message}</span>
    </div>
  )
}
