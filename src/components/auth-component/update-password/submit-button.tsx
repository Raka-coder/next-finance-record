'use client'

import { Button } from '@/components/ui/button'

// Props interface for the submit button
interface SubmitButtonProps {
  isLoading: boolean
}

// Reusable submit button component
export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? 'Menyimpan...' : 'Simpan kata sandi'}
    </Button>
  )
}