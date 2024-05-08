import { z } from 'zod'

const email = z.string().email({
  message: '유효하지 않은 이메일입니다',
})

const name = z
  .string()
  .trim()
  .min(2, {
    message: '사용자 이름은 2자보다 길어야 합니다',
  })
  .max(12, {
    message: '사용자 이름은 12자 이내여야 합니다',
  })

const nextAuthSchemaUserInput = z.object({
  email,
  name,
})

export const nextAuthSchemaSigninWithMaglicLinkInput =
  nextAuthSchemaUserInput.pick({
    email: true,
  })

export const nextAuthSchemaUpdateUserInput = nextAuthSchemaUserInput.pick({
  name: true,
})
