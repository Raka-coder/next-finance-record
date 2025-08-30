"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { supabase } from "@/utils/supabase/client"
import { ProfileService } from "@/services/profile.service"
import { registerFormSchema, RegisterFormValues } from "@/validation/schemas/register"
import { useState } from "react"
import { toast } from "sonner"
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
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.fullName,
        },
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.message("Periksa email Anda untuk link konfirmasi!")
      if (onRegisterSuccess) {
        onRegisterSuccess()
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