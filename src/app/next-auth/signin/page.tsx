import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { PAGE_HOME, SEARCH_PARAM_CALLBACK_URL } from '@/lib/constants'
import { PropsWithSearchParams } from '@/lib/utils-vanilla'

import { auth } from '../_components/next-auth.config'
import { PAGE_NEXT_AUTH_ERROR } from '../_components/next-auth.constants'
import NextAuthSigninForm from './next-auth-signin-form'

export default async function Page({ searchParams }: PropsWithSearchParams) {
  const error = searchParams['error']

  if (error) {
    redirect(PAGE_NEXT_AUTH_ERROR)
  }

  const session = await auth()

  if (session) {
    const callbackUrl = searchParams[SEARCH_PARAM_CALLBACK_URL]

    redirect(typeof callbackUrl === 'string' ? callbackUrl : PAGE_HOME)
  }

  return (
    <Suspense>
      <NextAuthSigninForm useMagicLinkSignin />
    </Suspense>
  )
}
