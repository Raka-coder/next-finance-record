import { z } from 'zod'

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Minimal 6 karakter' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  })

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>