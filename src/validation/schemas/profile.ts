import * as z from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(1, { message: "Nama lengkap wajib diisi" }),
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username hanya boleh huruf, angka, dan underscore" }),
})

export type ProfileSchema = z.infer<typeof profileSchema>