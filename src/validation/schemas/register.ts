import * as z from "zod"

export const registerFormSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>