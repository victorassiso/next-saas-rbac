import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
})

const { data, success, error } = envSchema.safeParse(process.env)

if (!success) {
  console.error('Invalid environment variables!', error.format())

  throw new Error('Invalid environment variables!')
}

export const env = data
