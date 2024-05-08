'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button, type ButtonProps } from './button'
import { TooltipWrapper } from './tooltip-wrapper'

export default function NextThemeToggleButton({ ...props }: ButtonProps) {
  const { theme, setTheme } = useTheme()

  function onClick() {
    if (!theme) {
      return null
    }

    return theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <TooltipWrapper tooltipContent={'테마'}>
      <Button
        variant={'ghost'}
        size={'icon'}
        className='rounded-full'
        onClick={onClick}
        {...props}
      >
        <SunIcon className='absolute h-6 w-6 scale-100 dark:scale-0' />
        <MoonIcon className='absolute h-6 w-6 scale-0 dark:scale-100' />
      </Button>
    </TooltipWrapper>
  )
}
