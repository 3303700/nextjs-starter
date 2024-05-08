'use client'

import { useMemo, useState } from 'react'

import { Button, type ButtonProps } from './button'

export default function ExpandableText({
  text,
  maxDisplay = 300,
  reShrinkable = false,
  ...props
}: {
  text: string | null | undefined
  maxDisplay?: number
  reShrinkable?: boolean
  buttonProps?: ButtonProps
} & React.HTMLAttributes<HTMLSpanElement>) {
  const [expanded, setExpanded] = useState(false)

  const showButton = useMemo(
    () => !expanded || reShrinkable,
    [expanded, reShrinkable],
  )

  if (!text) {
    return null
  }

  if (text.length <= maxDisplay) {
    return <p {...props}>{text}</p>
  }

  const renderedText = expanded ? text : `${text.substring(0, maxDisplay)}...`

  return (
    <p {...props}>
      {renderedText}{' '}
      {showButton && (
        <Button
          size={'sm'}
          className='ml-1 h-6 font-semibold'
          variant={'ghost'}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </p>
  )
}
