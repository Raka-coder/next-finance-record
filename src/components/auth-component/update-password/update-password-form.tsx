'use client'

import { cn } from '@/lib/utils'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { updatePasswordSchema } from '@/validation/schemas/update-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
} from '@/components/ui/form'
import { UpdatePasswordCard } from '../update-password-card'
import { PasswordField } from './password-field'
import { ConfirmPasswordField } from './confirm-password-field'
import { SubmitButton } from './submit-button'
import { ErrorMessage } from './error-message'

// Props interface for the main form component
interface UpdatePasswordFormProps extends React.ComponentPropsWithoutRef<'div'> {
  onPasswordUpdateSuccess?: () => void
}

// Main update password form component
export function UpdatePasswordForm({ className, onPasswordUpdateSuccess, ...props }: UpdatePasswordFormProps) {
  const router = useRouter()

  // Initialize form with Zod validation schema
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  // Handle form submission
  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    try {
      // Update user password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) throw error

      // Show success toast notification
      toast.success('Password berhasil diubah!', {
        description: 'Anda dapat login dengan password baru Anda.',
      })

      // Call success callback or redirect to login
      if (onPasswordUpdateSuccess) {
        onPasswordUpdateSuccess()
      } else {
        router.push('/login')
      }
    } catch (error) {
      // Set form-level error message
      form.setError('root', {
        message: error instanceof Error ? error.message : 'An error occurred while updating password',
      })
      
      // Show error toast notification
      toast.error('Gagal mengubah password', {
        description: 'Terjadi kesalahan saat mengubah password Anda.',
      })
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-[300px]', className)} {...props}>
      <UpdatePasswordCard>
        {/* Form provider that passes form methods to child components */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              {/* Password input field */}
              <PasswordField form={form} />

              {/* Confirm password input field */}
              <ConfirmPasswordField form={form} />
            </div>

            {/* Display form-level error message if exists */}
            <ErrorMessage message={form.formState.errors.root?.message} />

            {/* Submit button */}
            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </UpdatePasswordCard>
    </div>
  )
}