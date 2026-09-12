"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { createClient } from "@/utils/supabase/client"
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
    localStorage.removeItem('hasVisitedDashboard')

    const supabase = createClient()
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <EmailField />
          <PasswordField />
          <SubmitButton loading={isSubmitting} />
        </form>
      </Form>

      {form.formState.errors.root && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20 font-medium">
          {form.formState.errors.root.message}
        </div>
      )}

      <RegisterLink />
    </div>
  )
}