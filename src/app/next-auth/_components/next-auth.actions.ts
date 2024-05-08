'use server'

import { redirect } from 'next/navigation'

import { PAGE_UNAUTHORIZED, SEARCH_PARAM_CALLBACK_URL } from '@/lib/constants'
import prismaClient from '@/lib/prisma'
import {
  utilHandleErrorOnServerAction,
  type ServerActionResponse,
} from '@/lib/utils-vanilla'

import * as nextAuth from './next-auth.config'
import { PAGE_NEXT_AUTH_SIGN_IN } from './next-auth.constants'
import type {
  NextAuthPartialSessionUser,
  NextAuthSchemaSigninWithMagicLinkInput,
  NextAuthSessionUser,
} from './next-auth.types'

export async function nextAuthActionSigninWithOauth({
  provider,
  redirectTo,
}: {
  provider: 'github' | 'google'
  redirectTo: string
}): Promise<void> {
  await nextAuth.signIn(provider, { redirectTo })
}

export async function nextAuthActionSigninWithMagicLink(
  data: NextAuthSchemaSigninWithMagicLinkInput,
): Promise<ServerActionResponse<{ email: string }> | undefined> {
  try {
    await prismaClient.verificationToken.deleteMany({
      where: {
        identifier: data?.email,
      },
    })

    await nextAuth.signIn('nodemailer', {
      email: data.email,
      redirect: false,
    })

    return {
      data: {
        email: data.email,
      },
    }
  } catch (error) {
    return utilHandleErrorOnServerAction({ error })
  }
}

export async function nextAuthActionSignout(): Promise<void> {
  await nextAuth.signOut()
}

export async function nextAuthActionUpdateUser(
  data: Omit<NextAuthPartialSessionUser, 'email'>,
): Promise<
  ServerActionResponse<{
    updatedUser: Omit<NextAuthPartialSessionUser, 'email'>
  }>
> {
  try {
    const sessionUser = await nextAuthActionGetSessionUserOrRedirectAuthSignin()

    const updatedUser = await prismaClient.user.update({
      where: {
        id: sessionUser.id,
      },

      data,

      select: {
        name: true,
        image: true,
      },
    })

    return {
      data: {
        updatedUser,
      },
    }
  } catch (error) {
    return utilHandleErrorOnServerAction({ error })
  }
}

export async function nextAuthActionDeleteUser(): Promise<
  ServerActionResponse | undefined
> {
  try {
    const sessionUser = await nextAuthActionGetSessionUserOrRedirectAuthSignin()

    await prismaClient.user.delete({
      where: {
        id: sessionUser.id,
      },
    })
  } catch (error) {
    return utilHandleErrorOnServerAction({ error })
  }
}

async function nextAuthActionGetSessionUserOrUndefined(): Promise<
  NextAuthSessionUser | undefined
> {
  try {
    const session = await nextAuth.auth()

    if (!session) {
      return undefined
    }

    const { id, name, image, email, role } = session.user

    if (!id || !email) {
      return undefined
    }

    const user: NextAuthSessionUser = {
      id,
      email,
      name: name || email,
      image: image || null,
      role,
    }

    return user
  } catch (error) {
    return undefined
  }
}

export async function nextAuthActionGetSessionUserOrNull(): Promise<NextAuthSessionUser | null> {
  const sessionUser = await nextAuthActionGetSessionUserOrUndefined()

  if (!sessionUser) {
    return null
  }

  return sessionUser
}

function nextAuthActionRedirectAuthSignin(callbackUrl?: string): never {
  const authUrl = callbackUrl
    ? PAGE_NEXT_AUTH_SIGN_IN +
      '?' +
      SEARCH_PARAM_CALLBACK_URL +
      '=' +
      callbackUrl
    : PAGE_NEXT_AUTH_SIGN_IN

  redirect(authUrl)
}

export async function nextAuthActionGetSessionUserOrRedirectAuthSignin(
  callbackUrl?: string,
): Promise<NextAuthSessionUser> {
  const sessionUser = await nextAuthActionGetSessionUserOrUndefined()

  if (!sessionUser) {
    nextAuthActionRedirectAuthSignin(callbackUrl)
  }

  return sessionUser
}

export async function nextAuthActionGetAdminUserOrRedirectUnauthorized(
  callbackUrl?: string,
): Promise<NextAuthSessionUser> {
  const sessionUser =
    await nextAuthActionGetSessionUserOrRedirectAuthSignin(callbackUrl)

  if (sessionUser.role !== 'ADMIN') {
    redirect(PAGE_UNAUTHORIZED)
  }

  return sessionUser
}
