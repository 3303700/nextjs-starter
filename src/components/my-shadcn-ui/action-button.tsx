'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Button, type ButtonProps } from './button'

export default function ActionButton({
  className,
  children,
  disabled,
  action,
  enabled = true,
  ...props
}: {
  action: () => Promise<unknown>
  enabled?: boolean
} & ButtonProps) {
  const [pending, setPending] = useState(false)

  return (
    <Button
      disabled={pending || !enabled || disabled}
      className={cn(pending && 'animate-bounce', className)}
      onClick={async () => {
        setPending(true)

        await action()

        setPending(false)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
