'use client'

// Form components from shadcn/ui for structured form layout
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// Input component from shadcn/ui
import { Input } from '@/components/ui/input'
// React Hook Form hook for accessing form context
import { useForm } from 'react-hook-form'
// Zod library for schema validation
import * as z from 'zod'
// Validation schema for the forgot password form
import { forgotPasswordSchema } from '@/validation/schemas/forgot-password'

// Props interface for the EmailField component
interface EmailFieldProps {
  // Form instance from react-hook-form with typed schema
  form: ReturnType<typeof useForm<z.infer<typeof forgotPasswordSchema>>>
}

// Reusable email input field component with validation
// Integrates with react-hook-form and zod validation
export function EmailField({ form }: EmailFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="your@email.com"
              type="email"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}