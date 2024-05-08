'use client'

import useMyNextTheme from '@/hooks/use-next-theme'
import { cn, type PropsWithClassName } from '@/lib/utils'

export function DataColorModeWrapper({
  children,
  className,
}: React.PropsWithChildren & PropsWithClassName) {
  const { themeLoading, loadedTheme } = useMyNextTheme()

  return (
    <div
      data-color-mode={loadedTheme}
      hidden={themeLoading}
      className={cn(themeLoading && 'pointer-events-none', className)}
    >
      {children}
    </div>
  )
}
