'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export const MyProgressBarProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      {children}
      <ProgressBar
        height='3px'
        color='light-dark(#333b3c, #efefec)'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}
