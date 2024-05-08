import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { METADATA_TITLE } from '@/lib/constants'
import { Providers } from '@/providers/providers'

import { nextAuthPrefetchGetSessionUserOrNull } from './next-auth/_components/next-auth.queries'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: METADATA_TITLE,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryCleint = new QueryClient()

  await Promise.all([nextAuthPrefetchGetSessionUserOrNull(queryCleint)])

  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <Providers>
          <HydrationBoundary state={dehydrate(queryCleint)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  )
}
