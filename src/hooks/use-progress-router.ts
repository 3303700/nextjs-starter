'use client'

import { useRouter } from 'next-nprogress-bar'
import { useCallback } from 'react'

import { useUrl } from './use-next'

export default function useMyProgressBarRouter() {
  const router = useRouter()

  const { authSigninWithCallbackUrl } = useUrl()

  const pushAuthSigninWithCallback = useCallback(() => {
    if (authSigninWithCallbackUrl) {
      router.push(authSigninWithCallbackUrl)
    }
  }, [router, authSigninWithCallbackUrl])

  return {
    router,
    pushAuthSigninWithCallback,
  }
}
