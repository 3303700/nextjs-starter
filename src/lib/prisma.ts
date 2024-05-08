import { PrismaClient } from '@prisma/client'
// import { Pool, neonConfig } from '@neondatabase/serverless'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import ws from 'ws'

// import { safeEnv } from './safe-env'

// const prismaClientSingleton = () => {
//   neonConfig.webSocketConstructor = ws

//   const neon = new Pool({
//     // vercel db
//     connectionString: safeEnv.POSTGRES_PRISMA_URL,
//     // neon db
//     connectionString: safeEnv.DATABASE_URL,
//   })

//   const adapter = new PrismaNeon(neon)

//   return new PrismaClient({
//     adapter,
//   })
// }

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismaClient

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prismaClient
