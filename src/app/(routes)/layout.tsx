import React from 'react'

import MyNavbar from './navbar'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className='container relative min-h-dvh max-w-4xl flex-col bg-background'>
      <MyNavbar />
      <main className='flex-1'>{children}</main>
    </div>
  )
}
