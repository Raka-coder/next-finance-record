'use client'

import * as z from 'zod'
import { cn } from '@/lib/utils'
import { supabase } from '@/utils/supabase/client'
import { useState } from 'react'
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'
import { ForgotPasswordSuccess } from './forgot-password-success'
import { ForgotPasswordInputForm } from './forgot-password-input-form'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate email first
      const validatedEmail = forgotPasswordSchema.parse({ email })
      
      const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message)
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-[300px]', className)} {...props}>
      {success ? (
        <ForgotPasswordSuccess />
      ) : (
        <ForgotPasswordInputForm
          isLoading={isLoading}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  )
}