import type { Metadata } from 'next'

import { METADATA_TITLE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `AUTH - ${METADATA_TITLE}`,
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className='container h-dvh max-w-2xl'>{children}</div>
}
