import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>