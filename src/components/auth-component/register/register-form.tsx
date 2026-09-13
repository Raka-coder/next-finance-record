"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { signUp } from "@/lib/auth-client"
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
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const router = useRouter()

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
    const isUsernameValid = await validateUsername(data.username)
    if (!isUsernameValid) {
      setLoading(false)
      return
    }

    const { data: signUpData, error } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullName,
      callbackURL: "/dashboard",
    })

    if (error) {
      toast.error(error.message || "Gagal membuat akun")
    } else {
      if (signUpData?.user?.id) {
        try {
          await ProfileService.createProfile(signUpData.user.id, data.username, data.fullName)
        } catch (e) {
          console.error("Profile creation error:", e)
        }
      }

      toast.success("Registrasi berhasil! Mengalihkan ke dashboard...")
      if (onRegisterSuccess) {
        onRegisterSuccess()
      } else {
        router.push("/dashboard")
      }
    }
    setLoading(false)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FullNameField />
          <UsernameField />
          <EmailField />
          <PasswordField />
          <SubmitButton loading={loading} usernameError={usernameError} />
        </form>
      </Form>
      <LoginLink />
    </div>
  )
}