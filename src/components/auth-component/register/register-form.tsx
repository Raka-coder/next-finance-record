"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { createClient } from "@/utils/supabase/client"
import { ProfileService } from "@/services/profile.service"
import { registerFormSchema, type RegisterFormValues } from "@/validation/schemas/register"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FullNameField } from "./full-name-field"
import { UsernameField } from "./username-field"
import { EmailField } from "./email-field"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"
import { LoginLink } from "./login-link"

interface RegisterFormProps {
  onRegisterSuccess?: () => void
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  })

  // Async username validation
  const validateUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameError("Username minimal 3 karakter")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username hanya boleh mengandung huruf, angka, dan underscore")
      return false
    }
    const isAvailable = await ProfileService.checkUsernameAvailability(username)
    if (!isAvailable) {
      setUsernameError("Username sudah digunakan")
      return false
    }
    setUsernameError("")
    return true
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    setMessage("")
    const isUsernameValid = await validateUsername(data.username)
    if (!isUsernameValid) {
      setLoading(false)
      return
    }

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/confirm` : undefined,
        data: {
          username: data.username,
          full_name: data.fullName,
        },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      // Cek apakah user sudah terdaftar sebelumnya (Supabase security identity check)
      if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
        toast.error("Email ini sudah terdaftar. Silakan login atau reset password.")
      } else if (signUpData.session) {
        // Jika "Confirm email" di Supabase Dashboard dinonaktifkan, user langsung login
        toast.success("Registrasi berhasil! Mengalihkan ke dashboard...")
        if (onRegisterSuccess) {
          onRegisterSuccess()
        } else {
          router.push("/dashboard")
        }
      } else {
        // Jika "Confirm email" aktif, email konfirmasi dikirim oleh Supabase
        toast.message("Registrasi berhasil! Periksa email Anda untuk link konfirmasi.", {
          description: "Jika tidak ada di Inbox, pastikan periksa folder Spam/Junk.",
        })
        if (onRegisterSuccess) {
          onRegisterSuccess()
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-[300px] w-[280px]">
          <FullNameField />
          <UsernameField />
          <EmailField />
          <PasswordField />
          <SubmitButton loading={loading} usernameError={usernameError} />
        </form>
      </Form>
      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            message.includes("error") || message.includes("Error")
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}
      <LoginLink />
    </div>
  )
}