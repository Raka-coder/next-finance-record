'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
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

interface UpdatePasswordFormProps extends React.ComponentPropsWithoutRef<'div'> {
  onPasswordUpdateSuccess?: () => void
}

export function UpdatePasswordForm({ className, onPasswordUpdateSuccess, ...props }: UpdatePasswordFormProps) {
  const router = useRouter()

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
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) throw error

      toast.success('Password berhasil diubah!', {
        description: 'Anda dapat login dengan password baru Anda.',
      })

      if (onPasswordUpdateSuccess) {
        onPasswordUpdateSuccess()
      } else {
        router.push('/login')
      }
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'An error occurred while updating password',
      })
      toast.error('Gagal mengubah password', {
        description: 'Terjadi kesalahan saat mengubah password Anda.',
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