'use client'

// Props interface for the error message component
interface ErrorMessageProps {
  message?: string
}

// Reusable error message component
export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null
  return (
    <p className="text-sm text-red-500">
      {message}
    </p>
  )
}