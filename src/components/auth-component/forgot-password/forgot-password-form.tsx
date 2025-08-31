'use client'

// Zod library for schema validation
import * as z from 'zod'
// Utility function for conditionally joining CSS classes
import { cn } from '@/lib/utils'
// Supabase client for authentication operations
import { supabase } from '@/utils/supabase/client'
// React hook for managing component state
import { useState } from 'react'
// Toast library for displaying notifications
import { toast } from 'sonner'
// Validation schema for the forgot password form
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'
// Success component to show after successful password reset request
import { ForgotPasswordSuccess } from './success-card'
// Input form component that contains the actual form elements
import { ForgotPasswordInputForm } from './forgot-password-input-form'

// Props interface for the ForgotPasswordForm component
interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<'div'> {
  // Additional CSS classes to apply to the container
  className?: string
}

// Main forgot password form component
// Handles form submission, validation, and displays success or error messages
export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  // State for managing error messages
  const [, setError] = useState<string | null>(null)
  // State for tracking if the password reset request was successful
  const [success, setSuccess] = useState(false)
  // State for tracking if the request is currently loading
  const [isLoading, setIsLoading] = useState(false)

  // Handle the forgot password form submission
  const handleForgotPassword = async (email: string) => {
    // Set loading state to true and clear any previous errors
    setIsLoading(true)
    setError(null)

    try {
      // Validate email using Zod schema
      const validatedEmail = forgotPasswordSchema.parse({ email })
      
      // Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      
      // Throw error if Supabase returns one
      if (error) throw error
      
      // Show success toast notification
      toast.success('Email terkirim!', {
        description: 'Periksa email Anda untuk instruksi reset password.',
      })
      
      // Set success state to true if no errors occurred
      setSuccess(true)
    } catch (error: unknown) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message)
      } else {
        // Handle other errors
        setError(error instanceof Error ? error.message : 'An error occurred')
        // Show error toast notification
        toast.error('Gagal mengirim email', {
          description: 'Terjadi kesalahan saat mengirim email reset password.',
        })
      }
    } finally {
      // Always set loading state to false when request completes
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 md:w-[300px] w-[280px]', className)} {...props}>
      {success ? (
        // Show success message if request was successful
        <ForgotPasswordSuccess />
      ) : (
        // Show input form if request hasn't been sent or was unsuccessful
        <ForgotPasswordInputForm
          isLoading={isLoading}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  )
}