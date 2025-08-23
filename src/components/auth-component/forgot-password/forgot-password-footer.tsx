'use client'

import Link from 'next/link'

export function ForgotPasswordFooter() {
  return (
    <div className="mt-4 text-center text-sm">
      Already have an account?{' '}
      <Link href="/login" className="underline underline-offset-4">
        Login
      </Link>
    </div>
  )
}