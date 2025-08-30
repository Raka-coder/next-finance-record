"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { supabase } from "@/utils/supabase/client"
import { loginFormSchema, LoginFormValues } from "@/validation/schemas/login"
import { useRouter } from "next/navigation"
import { EmailField } from "./email-field"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"
import { RegisterLink } from "./register-link"

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: LoginFormValues) => {
    // Hapus flag sebelum login untuk memastikan toast menampilkan pesan yang tepat
    localStorage.removeItem('hasVisitedDashboard')

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      form.setError("root", {
        message: error.message,
      })
    } else {
      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-[300px] w-[280px]">
          <EmailField />
          <PasswordField />
          <SubmitButton loading={isSubmitting} />
        </form>
      </Form>

      {form.formState.errors.root && (
        <div className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
          {form.formState.errors.root.message}
        </div>
      )}

      <RegisterLink />
    </div>
  )
}