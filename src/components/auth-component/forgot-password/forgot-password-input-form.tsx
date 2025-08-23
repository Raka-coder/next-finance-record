'use client'

import { ForgotPasswordCard } from './forgot-password-card'
import { ForgotPasswordFormContent } from './forgot-password-form-content'

interface ForgotPasswordInputFormProps {
  isLoading: boolean
  onSubmit: (email: string) => void
}

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