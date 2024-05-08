import { cn, type PropsWithClassName } from '@/lib/utils'

export default function NothingToSeeHereYet({
  className,
  children = <span>Nothing to see here yet</span>,
}: PropsWithClassName & React.PropsWithChildren) {
  return (
    <div className={cn(`py-12 text-center text-muted-foreground`, className)}>
      {children}
    </div>
  )
}
