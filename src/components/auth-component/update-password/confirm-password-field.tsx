'use client'

import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updatePasswordSchema } from '@/validation/schemas/update-password'

// Props interface for the confirm password input field
interface ConfirmPasswordFieldProps {
  form: ReturnType<typeof useForm<z.infer<typeof updatePasswordSchema>>>
}

// Reusable confirm password input field component
export function ConfirmPasswordField({ form }: ConfirmPasswordFieldProps) {
  return (
    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              placeholder="Confirm password"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}