'use client'

// Component for the login link
import LoginLink from "./login-link"

// Footer component for the forgot password card
// Displays a link to the login page for users who already have an account
export function ForgotPasswordFooter() {
  return (
    <div className="mt-4 text-center text-sm">
      Sudah punya akun?{' '}
      <LoginLink />
    </div>
  )
}