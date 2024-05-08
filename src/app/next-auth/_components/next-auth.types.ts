import type { Session } from 'next-auth'
import { z } from 'zod'

import {
  nextAuthSchemaSigninWithMaglicLinkInput,
  nextAuthSchemaUpdateUserInput,
} from './next-auth.schemas'

export type NextAuthSchemaSigninWithMagicLinkInput = z.infer<
  typeof nextAuthSchemaSigninWithMaglicLinkInput
>

export type NextAuthSchemaUpdateUserInput = z.infer<
  typeof nextAuthSchemaUpdateUserInput
>

export type NextAuthSessionUser = Required<Session['user']>

export type NextAuthPartialSessionUser = Partial<NextAuthSessionUser>
