'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
// Props interface for the submit button
interface SubmitButtonProps {
  isLoading: boolean
}

// Reusable submit button component
export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        Memproses...
        </>
      ) : 'Simpan kata sandi'}
    </Button>
  )
}