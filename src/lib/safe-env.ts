import { cleanEnv, str } from 'envalid'

export const safeEnv = cleanEnv(process.env, {
  // neon db,  supabase db
  DATABASE_URL: str(),
  // vercel db
  POSTGRES_PRISMA_URL: str(),
})
