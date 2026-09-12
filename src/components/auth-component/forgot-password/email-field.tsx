'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'
import { Mail } from 'lucide-react'

interface EmailFieldProps {
  form: ReturnType<typeof useForm<z.infer<typeof forgotPasswordSchema>>>
}

export function EmailField({ form }: EmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Email</FormLabel>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="nama@email.com"
                type="email"
                autoComplete="email"
                className="pl-9"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}