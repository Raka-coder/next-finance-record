'use client'

import * as z from 'zod'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'
import { ForgotPasswordSuccess } from './success-card'
import { ForgotPasswordInputForm } from './forgot-password-input-form'

interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const validatedEmail = forgotPasswordSchema.parse({ email })
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      
      if (error) throw error
      
      toast.success('Email terkirim!', {
        description: 'Periksa email Anda untuk instruksi reset password.',
      })
      
      setSuccess(true)
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message)
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred')
        toast.error('Gagal mengirim email', {
          description: 'Terjadi kesalahan saat mengirim email reset password.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-[420px]', className)} {...props}>
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