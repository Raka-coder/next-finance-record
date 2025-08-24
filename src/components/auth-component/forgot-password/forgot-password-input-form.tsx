'use client'

// Card component that wraps the form
import { ForgotPasswordCard } from '../forgot-password-card'
// Form content component with input fields and submit button
import { ForgotPasswordFormContent } from './forgot-password-form-content'

// Props interface for the ForgotPasswordInputForm component
interface ForgotPasswordInputFormProps {
  // Loading state to pass to the submit button
  isLoading: boolean
  // Function to handle form submission
  onSubmit: (email: string) => void
}

// Input form component that combines the card wrapper and form content
// Acts as a container for the forgot password form
export function ForgotPasswordInputForm({
  isLoading,
  onSubmit,
}: ForgotPasswordInputFormProps) {
  return (
    <ForgotPasswordCard>
      <ForgotPasswordFormContent 
        isLoading={isLoading} 
        onSubmit={onSubmit} 
      />
    </ForgotPasswordCard>
  )
}