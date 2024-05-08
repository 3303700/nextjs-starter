import { cleanEnv, str } from 'envalid'

export const nextAuthSafeEnv = cleanEnv(process.env, {
  EMAIL_SERVER: str(),
  EMAIL_FROM: str(),
})
