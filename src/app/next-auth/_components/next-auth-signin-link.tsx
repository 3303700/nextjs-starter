'use client'

import { AvatarIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { TooltipWrapper } from '@/components/my-shadcn-ui/tooltip-wrapper'
import { useUrl } from '@/hooks/use-next'

export default function NextAuthSigninLink({
  children = (
    <TooltipWrapper
      tooltipContent={'로그인'}
      align='end'
    >
      <AvatarIcon className='h-7 w-7 rounded-full hover:animate-pulse hover:ring-2' />
    </TooltipWrapper>
  ),
}: React.PropsWithChildren) {
  const { authSigninWithCallbackUrl } = useUrl()

  return <Link href={authSigninWithCallbackUrl}>{children}</Link>
}
