'use client'

// Button component from shadcn/ui
import { Button } from '@/components/ui/button'

// Props interface for the SubmitButton component
interface SubmitButtonProps {
  // Loading state to disable button and show loading text
  isLoading: boolean
}

// Reusable submit button component with loading state
// Disables button and shows loading text when isLoading is true
export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send reset email'}
    </Button>
  )
}