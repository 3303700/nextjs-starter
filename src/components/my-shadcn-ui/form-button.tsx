import { cn } from '@/lib/utils'

import { Button, type ButtonProps } from './button'

export default function FormButton({
  className,
  pending,
  isValid,
  isDirty,
  isDisabled,
  children,
  ...props
}: {
  pending: boolean
  isValid: boolean
  isDirty: boolean
  isDisabled?: boolean
} & ButtonProps) {
  return (
    <Button
      type='submit'
      disabled={pending || !isValid || !isDirty || isDisabled}
      className={cn(pending && 'animate-bounce', className)}
      {...props}
    >
      {children}
    </Button>
  )
}
