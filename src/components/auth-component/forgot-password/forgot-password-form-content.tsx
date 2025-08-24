'use client'

// Zod resolver for react-hook-form validation
import { zodResolver } from '@hookform/resolvers/zod'
// Hook for managing form state and validation
import { useForm } from 'react-hook-form'
// Zod library for schema validation
import * as z from 'zod'
// Form provider component from shadcn/ui
import {
  Form,
} from '@/components/ui/form'
// Validation schema for the forgot password form
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'
// Custom email input field component
import { EmailField } from './email-field'
// Custom submit button component
import { SubmitButton } from './submit-button'

// Props interface for the ForgotPasswordFormContent component
interface ForgotPasswordFormContentProps {
  // Loading state for the submit button
  isLoading: boolean
  // Function to handle form submission
  onSubmit: (email: string) => void
}

// Form content component for the forgot password form
// Manages form state, validation, and submission
export function ForgotPasswordFormContent({
  isLoading,
  onSubmit,
}: ForgotPasswordFormContentProps) {
  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  // Handle form submission by calling the onSubmit prop with validated email
  function handleSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    onSubmit(data.email)
  }

  return (
    <Form {...form}>
      {/* Form element with submit handler */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Email input field */}
        <EmailField form={form} />
        {/* Submit button with loading state */}
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  )
}