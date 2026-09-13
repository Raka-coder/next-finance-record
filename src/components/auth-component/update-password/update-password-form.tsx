'use client'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { updatePasswordSchema } from '@/validation/schemas/update-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { UpdatePasswordCard } from '../update-password-card'
import { PasswordField } from './password-field'
import { ConfirmPasswordField } from './confirm-password-field'
import { SubmitButton } from './submit-button'
import { ErrorMessage } from './error-message'

interface UpdatePasswordFormProps extends React.ComponentPropsWithoutRef<'div'> {
  onPasswordUpdateSuccess?: () => void
}

export function UpdatePasswordForm({ className, onPasswordUpdateSuccess, ...props }: UpdatePasswordFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    try {
      if (!token) {
        throw new Error('Token reset password tidak valid atau telah kedaluwarsa')
      }

      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      })

      if (error) throw new Error(error.message || 'Gagal mengubah kata sandi')

      toast.success('Password berhasil diubah!', {
        description: 'Anda dapat login dengan password baru Anda.',
      })

      if (onPasswordUpdateSuccess) {
        onPasswordUpdateSuccess()
      } else {
        router.push('/login')
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengubah password'
      form.setError('root', {
        message: msg,
      })
      toast.error('Gagal mengubah password', {
        description: msg,
      })
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-[420px]', className)} {...props}>
      <UpdatePasswordCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3">
              <PasswordField form={form} />
              <ConfirmPasswordField form={form} />
            </div>

            <ErrorMessage message={form.formState.errors.root?.message} />

            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </UpdatePasswordCard>
    </div>
  )
}