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

// Props interface for the password input field
interface PasswordFieldProps {
  form: ReturnType<typeof useForm<z.infer<typeof updatePasswordSchema>>>
}

// Reusable password input field component
export function PasswordField({ form }: PasswordFieldProps) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              placeholder="New password"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}