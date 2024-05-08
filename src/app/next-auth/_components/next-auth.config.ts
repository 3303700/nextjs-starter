import { PrismaAdapter } from '@auth/prisma-adapter'
import { render } from '@react-email/render'
import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import NodeMailer, { NodemailerConfig } from 'next-auth/providers/nodemailer'
import { createTransport } from 'nodemailer'

import prismaClient from '@/lib/prisma'

import { User } from '@prisma/client'
import NextAuthSigninLinkEmail from './next-auth-emails'
import {
  PAGE_NEXT_AUTH_ERROR,
  PAGE_NEXT_AUTH_SIGN_IN,
} from './next-auth.constants'
import { nextAuthSafeEnv } from './next-auth.safe-env'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,

  adapter: PrismaAdapter(prismaClient),

  providers: [
    NodeMailer({
      server: nextAuthSafeEnv.EMAIL_SERVER,
      from: nextAuthSafeEnv.EMAIL_FROM,
      sendVerificationRequest,
    }),

    Google({
      allowDangerousEmailAccountLinking: true,
    }),

    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: PAGE_NEXT_AUTH_SIGN_IN,
    error: PAGE_NEXT_AUTH_ERROR,
  },
})

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: User['role']
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

async function sendVerificationRequest(params: {
  identifier: string
  url: string
  expires: Date
  provider: NodemailerConfig
  token: string
  request: Request
}) {
  const { identifier, url, provider } = params

  const { host } = new URL(url)

  const transport = createTransport(provider.server)

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `${host}에 로그인하기`,
    html: html({ url }),
  })

  const failed = result.rejected.concat(result.pending).filter(Boolean)

  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}

function html(params: { url: string }) {
  const { url } = params

  return render(NextAuthSigninLinkEmail({ url }))
}
