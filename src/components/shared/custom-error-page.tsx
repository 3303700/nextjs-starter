import Link from 'next/link'

import { PAGE_HOME } from '@/lib/constants'

export default function CustomErrorPage({
  children = 'Something went wrong...',
}: React.PropsWithChildren) {
  return (
    <div className='flex h-dvh flex-col items-center justify-center gap-2 text-balance'>
      <p>{children}</p>
      <Link
        href={PAGE_HOME}
        className='text-muted-foreground underline decoration-muted-foreground underline-offset-4 hover:underline'
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
