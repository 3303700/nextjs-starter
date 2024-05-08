import type { Metadata } from 'next'

import { METADATA_TITLE } from '@/lib/constants'

import { NEXT_AUTH_META_TITLE } from './_components/next-auth.constants'

export const metadata: Metadata = {
  title: `${NEXT_AUTH_META_TITLE} - ${METADATA_TITLE}`,
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className='container h-dvh max-w-2xl'>{children}</div>
}
