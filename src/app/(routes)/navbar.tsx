import Link from 'next/link'

import NextThemeToggleButton from '@/components/my-shadcn-ui/next-theme-toggle-button'
import { PAGE_HOME } from '@/lib/constants'

import NextAuthUserButton from '../next-auth/_components/next-auth-user-button'

export default function MyNavbar() {
  return (
    <nav className='sticky top-0 z-10 flex w-full items-center justify-between py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <Link href={PAGE_HOME}>HOME</Link>

      <div className='flex w-fit items-center gap-2'>
        <NextThemeToggleButton />

        <NextAuthUserButton />
      </div>
    </nav>
  )
}
